import {
  Controller,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { ExpenseDto } from './dto/expense.dto';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';

@UseGuards(AuthenticatedGuard)
@Controller('expenses/:groupId')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post('upsert')
  @HttpCode(HttpStatus.OK) // Return 200 for both create and update for simplicity
  async upsertExpense(
    @Req() req,
    @Param('groupId') groupId: string,
    @Body() expenseData: ExpenseDto,
  ) {
    return this.expenseService.upsertExpense(req.user, groupId, expenseData);
  }

  @Delete(':expenseId/delete')
  @HttpCode(HttpStatus.OK)
  async deleteExpense(
    @Req() req,
    @Param('groupId') groupId: string,
    @Param('expenseId') expenseId: string,
  ) {
    return this.expenseService.deleteExpense(req.user, expenseId, groupId);
  }
}
