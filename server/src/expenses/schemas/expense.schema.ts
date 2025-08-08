import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import * as mongoose from "mongoose";

@Schema({ _id: false })
class SplitDetail extends Document {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    user: mongoose.Types.ObjectId;

    @Prop({ required: true })
    splitAmount: number;

    @Prop({ default: true })
    isEnabled: boolean;
}

const SplitDetailSchema = SchemaFactory.createForClass(SplitDetail);

@Schema({ timestamps: true })
export class Expense extends Document {
    @Prop({ required: true })
    title: string;

    @Prop()
    description: string;

    @Prop({ required: true })
    amount: number;

    @Prop({ required: true, enum: ['deposit', 'expense'] })
    type: 'deposit' | 'expense';

    @Prop({ required: true, enum: ['equal', 'fixed', 'percentage'] })
    splitMethod: 'equal' | 'fixed' | 'percentage';

    @Prop({ required: true })
    currency: string;

    @Prop({ required: true, type: Date, default: Date.now })
    paidAt: Date;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    createdBy: mongoose.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    paidBy: mongoose.Types.ObjectId;

    @Prop({ type: [SplitDetailSchema] })
    splitDetails: SplitDetail[];

}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);
export type ExpenseDocument = Expense & Document;