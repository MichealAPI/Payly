import { Body, Controller, Param, Post, Request, UseGuards } from "@nestjs/common";
import { InvitesService } from "./invites.service";
import { AuthenticatedGuard } from "src/auth/guards/authenticated.guard";
import { GroupsService } from "src/groups/groups.service";
import { BadRequestException } from "@nestjs/common/exceptions";

@Controller("invites")
@UseGuards(AuthenticatedGuard)
export class InvitesController {
  
    constructor(
        private readonly invitesService: InvitesService,
        private readonly groupsService: GroupsService
    ) {}

    @Post(":groupId/create")
    async createInvite(@Request() req, @Param("groupId") groupId: string) {

        const currentUser = req.user;

        if (!(await this.groupsService.isGroupMember(currentUser._id, groupId))) {
            throw new BadRequestException('User is not a member of the group');
        }

        return this.invitesService.createInvite(
            groupId,
            currentUser._id,
        );
    }

    @Post(":inviteCode/join")
    async joinGroup(@Request() req, @Param("inviteCode") inviteCode: string) {
        const currentUser = req.user;

        return this.invitesService.acceptInvite(
            currentUser._id,
            inviteCode,
        );
    }

}