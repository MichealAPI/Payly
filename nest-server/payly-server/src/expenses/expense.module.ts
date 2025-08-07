import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Expense, ExpenseSchema } from './schemas/expense.schema';
import { ExpenseController } from './expense.controller';
import { ExpenseService } from './expense.service';
import { GroupsModule } from 'src/groups/groups.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Expense.name, schema: ExpenseSchema }]),
    GroupsModule,
  ],
  controllers: [ExpenseController],
  providers: [ExpenseService],
})
export class ExpenseModule {}