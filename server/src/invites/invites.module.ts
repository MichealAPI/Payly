import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Invite, InviteSchema } from './schemas/invites.schema';
import { InvitesService } from './invites.service';
import { InvitesController } from './invites.controller';
import { GroupsModule } from 'src/groups/groups.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Invite.name, schema: InviteSchema }]),
    GroupsModule
  ],
  exports: [InvitesService],
  controllers: [InvitesController],
  providers: [InvitesService],
})
export class InvitesModule {}
