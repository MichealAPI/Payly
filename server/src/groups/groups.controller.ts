import { Body, Controller, Delete, Get, Param, Post, UseGuards, Request } from "@nestjs/common";
import { UpsertGroupDto } from "./dto/upsert-group.dto";
import { AuthenticatedGuard } from "../auth/guards/authenticated.guard";
import { GroupsService } from "./groups.service";

@Controller('groups')
@UseGuards(AuthenticatedGuard)
export class GroupsController {

    constructor(private readonly groupsService: GroupsService) {}

    @Get('list')
    getGroups(@Request() req) {
        const currentUser = req.user;
        return this.groupsService.getUserGroups(currentUser);
    }

    @Get(':groupId/retrieve')
    retrieveGroup(@Request() req, @Param('groupId') groupId: string) {
        const currentUser = req.user;
        return this.groupsService.retrieveGroup(currentUser, groupId);
    }

    @Delete(':groupId/delete')
    deleteGroup(@Request() req, @Param('groupId') groupId: string) {
        const currentUser = req.user;
        return this.groupsService.deleteGroup(currentUser, groupId);
    }

    @Get(':groupId/balances')
    getUserGroupBalances(@Request() req, @Param('groupId') groupId: string) {
        const currentUser = req.user;
        return this.groupsService.getUserGroupBalances(currentUser, groupId);
    }

    @Post('upsert')
    createGroup(@Request() req, @Body() upsertGroupDto: UpsertGroupDto) {
        const currentUser = req.user;
        return this.groupsService.upsertGroup(currentUser, upsertGroupDto);
    }

    @Post(':groupId/:userId/kick')
    kickUser(@Request() req, @Param('groupId') groupId: string, @Param('userId') userId: string) {
        const currentUser = req.user;
        return this.groupsService.kickUser(currentUser, groupId, userId);
    }

}