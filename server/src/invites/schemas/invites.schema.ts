import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { Document } from "mongoose";

@Schema()
export class Invite extends Document {
    @Prop({required: true})
    groupId: mongoose.Types.ObjectId;

    @Prop({required: true})
    inviterId: mongoose.Types.ObjectId;

    @Prop({unique: true, required: true, default: () => uuidv4().substring(0, 8)})
    code: string;

    @Prop({default: 'pending'})
    status: 'pending' | 'accepted' | 'declined'; 

    @Prop({type: Date, default: Date.now, expires: '7d'})
    createdAt: Date;
}

export const InviteSchema = SchemaFactory.createForClass(Invite);