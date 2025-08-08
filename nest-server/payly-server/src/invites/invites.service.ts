import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Invite } from "./schemas/invites.schema";
import { Model } from "mongoose";
import { GroupsService } from "src/groups/groups.service";
import * as mongoose from "mongoose";

@Injectable()
export class InvitesService {

    constructor(
        @InjectModel(Invite.name) private readonly inviteModel: Model<Invite>,
        private readonly groupsService: GroupsService,
    ) {}

    async createInvite(groupId: string, currentUserId: string): Promise<{ code: string }> {
        
        // Prevent user from spamming invites
        const existingInvite = await this.inviteModel.findOne({ groupId, inviterId: currentUserId }).exec();
        if (existingInvite) {
            return { code: existingInvite.code };
        }

        const invite = new this.inviteModel({
            groupId,
            inviterId: currentUserId,
        });
        
        const savedInvite = await invite.save();

        return { code: savedInvite.code };
    }


    async getInviteByCode(code: string): Promise<Invite | null> {
        return this.inviteModel.findOne({ code }).exec();
    }

    async deleteInvite(inviteId: string | mongoose.Types.ObjectId): Promise<void> {
        await this.inviteModel.findByIdAndDelete(inviteId).exec();
    }

    async acceptInvite(targetId: mongoose.Types.ObjectId, code: string, deleteAfter: boolean=true): Promise<Invite | null> {
        const invite = await this.getInviteByCode(code);
        if (!invite) {
            return null; // Invite not found
        }

        const response = await this.groupsService.addMember(
            invite.groupId,
            targetId
        );

        if (!response) {
            throw new InternalServerErrorException("Failed to add member to group");
        }

        // Delete the invite if specified
        if (deleteAfter) {
            await this.deleteInvite((invite._id as any));
        }

        
        return invite;
    }


}