import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Expense } from './schemas/expense.schema';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import type { ExpenseDocument } from './schemas/expense.schema';
import { GroupsService } from 'src/groups/groups.service';
import * as mongoose from 'mongoose';
import { ExpenseDto } from './dto/expense.dto';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectModel(Expense.name)
    private readonly expenseModel: Model<ExpenseDocument>,
    private readonly groupsService: GroupsService,
  ) {}

  async upsertExpense(
    currentUser,
    groupId: string,
    expenseData: ExpenseDto,
  ): Promise<any> {
    if (!(await this.groupsService.isGroupMember(currentUser._id, groupId))) {
      throw new BadRequestException('User is not a member of the group');
    }

    const transformedData = {
      ...expenseData,
      paidBy: new mongoose.Types.ObjectId(expenseData.paidBy),
      splitDetails: expenseData.splitDetails?.map((detail) => ({
        ...detail,
        user: new mongoose.Types.ObjectId(detail.user),
      })),
    };

    let savedExpense;

    if (expenseData._id) {
      // --- UPDATE LOGIC ---
      const expenseId = new mongoose.Types.ObjectId(expenseData._id);
      const existingExpense = await this.expenseModel.findById(expenseId).exec();

      if (!existingExpense) {
        throw new NotFoundException('Expense not found');
      }

      savedExpense = await this.expenseModel
        .findByIdAndUpdate(
          expenseId,
          { ...transformedData, createdBy: currentUser._id },
          { new: true, runValidators: true },
        )
        .exec();
    } else {
      // --- CREATE LOGIC ---
      const newExpense = await this.expenseModel.create({
        ...transformedData,
        createdBy: currentUser._id,
      });

      await this.groupsService.addExpense(
        groupId,
        newExpense._id as mongoose.Types.ObjectId,
      );
      savedExpense = newExpense;
    }

    if (savedExpense) {
      const result = await this.expenseModel.populate(savedExpense, [
        {
          path: 'paidBy',
          select: 'firstName lastName email _id',
        },
        {
          path: 'splitDetails.user',
          select: 'firstName lastName email _id settings',
          populate: {
            path: 'settings',
            match: { key: 'profile-picture' },
          },
        },
      ]);

      return {
        message: `Expense ${expenseData._id ? 'updated' : 'created'} successfully!`,
        expense: result,
      };
    }
  }

  async deleteExpense(
    currentUser,
    expenseId: string,
    groupId: string,
  ): Promise<any> {
    if (!(await this.groupsService.isGroupMember(currentUser, groupId))) {
      throw new BadRequestException('User is not a member of the group');
    }

    const expense = await this.expenseModel.findById(expenseId).exec();

    if (!expense) {
      throw new BadRequestException('Expense not found');
    }

    const expenseObjectId: mongoose.Types.ObjectId =
      new mongoose.Types.ObjectId(expenseId);

    // remove the one-to-many relationship from the group
    if (!await this.groupsService.removeExpense(groupId, expenseObjectId)) {
      throw new BadRequestException('Failed to remove expense from group');
    }

    await this.expenseModel.deleteOne({ _id: expenseObjectId }).exec();

    return { message: 'Expense deleted successfully!' };
  }
}
