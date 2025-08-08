import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema()
export class Group extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  icon: string;

  @Prop({ required: true, type: mongoose.Types.ObjectId, ref: 'User' })
  owner: mongoose.Types.ObjectId;

  @Prop({ type: [{ type: mongoose.Types.ObjectId, ref: 'User' }],  default: [] })
  members: mongoose.Types.ObjectId[];

  @Prop({ type: [{ type: mongoose.Types.ObjectId, ref: 'Expense' }] })
  expenses: mongoose.Types.ObjectId[];

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const GroupSchema = SchemaFactory.createForClass(Group);