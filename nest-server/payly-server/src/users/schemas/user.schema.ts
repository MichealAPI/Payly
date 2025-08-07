import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema()
export class User extends Document {

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: [] })
  settings: { key: string; value: any }[];
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = User & Document;