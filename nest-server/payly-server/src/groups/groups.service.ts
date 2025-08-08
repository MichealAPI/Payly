import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Group } from './schemas/group.schema';
import { Model } from 'mongoose';
import { UpsertGroupDto } from './dto/upsert-group.dto';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/users/schemas/user.schema';
import * as mongoose from 'mongoose';
import { Expense } from 'src/expenses/schemas/expense.schema';
import { calculateBalances } from 'src/utils/calculateBalance';
import path from 'path';

@Injectable()
export class GroupsService {
  constructor(
    @InjectModel(Group.name) private readonly groupModel: Model<Group>,
    private readonly authService: AuthService,
  ) {}

  async upsertGroup(
    currentUser: User,
    upsertGroupDto: UpsertGroupDto,
  ): Promise<Group> {
    const filter = {
      name: upsertGroupDto.name,
      owner: currentUser._id,
    };

    const update = {
      ...upsertGroupDto, // This will update description, icon, etc.
      $setOnInsert: {
        owner: currentUser._id,
        members: [currentUser._id], // On creation, owner is the first member
        balances: {},
      },
    };

    return this.groupModel
      .findOneAndUpdate(filter, update, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      })
      .exec();
  }

  async getUserGroups(currentUser: User): Promise<Group[]> {
    return this.groupModel
      .find({ $or: [{ owner: currentUser._id }, { members: currentUser._id }] })
      .populate({
        path: 'members',
        model: 'User',
        select: 'firstName lastName email _id',
      })
      .exec();
  }

  async deleteGroup(
    currentUser: User,
    groupId: string,
  ): Promise<{ message: string }> {
    const group = await this.groupModel.findById(groupId).exec();

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    if (!group.owner.equals(currentUser._id as any)) {
      throw new ForbiddenException('Only the group owner can delete the group');
    }

    const response = await group.deleteOne().exec();

    if (!response.deletedCount) {
      throw new BadRequestException('Failed to delete group');
    }

    return { message: 'Group deleted successfully' };
  }

  async retrieveGroup(currentUser: User, groupId: string): Promise<Group> {
    const group = await this.groupModel
      .findById(groupId)
      .populate([
        {
          path: 'members',
          select: 'firstName lastName email _id settings',
        },
        {
          path: 'expenses',
          populate: [
            {
              path: 'paidBy',
              select: 'firstName lastName email _id',
            },
            {
              path: 'splitDetails.user',
              select: 'firstName lastName email _id settings',
              populate: [
                {
                  path: 'settings',
                  match: { key: 'profilePicture' },
                },
                {
                  path: 'settings',
                  match: { key: 'profilePictureVersion' },
                },
              ],
            },
          ],
        },
      ])
      .exec();
    if (!group) {
      throw new NotFoundException('Group not found');
    }

    const isMember = group.members.find(
      (member) => {
        return member._id.toString() === (currentUser._id as mongoose.Types.ObjectId).toString();
      }
    );

    const isOwner = group.owner.equals(currentUser._id as any);

    if (
      !isMember &&
      !isOwner
    ) {
      throw new ForbiddenException('You are not a member of this group');
    }

    return group;
  }

  async kickUser(
    currentUser: User,
    groupId: string,
    userId: string,
  ): Promise<{ message: string }> {
    const group = await this.groupModel
      .findById(groupId)
      .populate<{ expenses: Expense[] }>('expenses')
      .exec();

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID format');
    }

    const userIdObject = new mongoose.Types.ObjectId(userId);

    if (!group.owner.equals(currentUser._id as any)) {
      throw new ForbiddenException('Only the group owner can kick users');
    }

    if (group.owner.equals(userIdObject)) {
      throw new ForbiddenException('Cannot kick the group owner');
    }

    if (!group.members.includes(userIdObject)) {
      throw new BadRequestException('User is not a member of this group');
    }

    // Check if users is involved in any expenses
    if (
      group.expenses.some(
        (expense) =>
          expense.paidBy.equals(userIdObject) ||
          expense.splitDetails.some((detail) =>
            detail.user.equals(userIdObject),
          ),
      )
    ) {
      throw new BadRequestException(
        'Cannot kick user who is involved in expenses. Please resolve expenses first.',
      );
    }

    group.members = group.members.filter(
      (member) => !member.equals(userIdObject),
    );
    await group.save();

    return { message: 'User kicked from group successfully' };
  }

  async addMember(
    groupId: string | mongoose.Types.ObjectId,
    userId: mongoose.Types.ObjectId,
  ): Promise<{ message: string }> {
    const group = await this.groupModel.findById(groupId).exec();

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID format');
    }

    const userIdObject = new mongoose.Types.ObjectId(userId);
    if (group.members.includes(userIdObject)) {
      throw new BadRequestException('User is already a member of this group');
    }

    group.members.push(userIdObject);
    await group.save();
    return { message: 'User added to group successfully' };
  }

  async addExpense(
    groupId: string,
    expenseId: mongoose.Types.ObjectId,
  ): Promise<Group> {
    const group = await this.groupModel.findById(groupId).exec();

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    if (group.expenses.includes(expenseId)) {
      throw new BadRequestException(
        'Expense is already associated with this group',
      );
    }

    group.expenses.push(expenseId);
    await group.save();

    return group;
  }

  async removeExpense(
    groupId: string,
    expenseId: mongoose.Types.ObjectId,
  ): Promise<Group> {
    const group = await this.groupModel.findById(groupId).exec();
    if (!group) {
      throw new NotFoundException('Group not found');
    }

    if (!group.expenses.includes(expenseId)) {
      throw new BadRequestException(
        'Expense is not associated with this group',
      );
    }

    group.expenses = group.expenses.filter(
      (expense) => !expense.equals(expenseId),
    );
    await group.save();
    return group;
  }

  async isGroupMember(currentUser: User, groupId: string): Promise<boolean> {
    const group = await this.groupModel.findById(groupId).exec();
    if (!group) {
      throw new NotFoundException('Group not found');
    }

    return (
      group.members.includes(currentUser._id as any) ||
      group.owner.equals(currentUser._id as any)
    );
  } // todo use this to simplify other methods

  async getUserGroupBalances(currentUser: User, groupId: string): Promise<any> {
    const group = await this.groupModel
      .findById(groupId)
      .populate<{
        expenses: Expense[];
      }>({
        path: 'expenses',
        populate: {
          path: 'splitDetails.user',
          model: 'User',
        },
      })
      .exec();

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    if (!this.isGroupMember(currentUser, groupId)) {
      throw new ForbiddenException('You are not a member of this group');
    }

    return calculateBalances(
      group.expenses,
      (currentUser._id as any).toString(),
    );
  }
}
