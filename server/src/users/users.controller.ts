import { Body, Controller, Get, Param, Put, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { SettingsUpdateDto } from './dto/settings-update.dto';
import { multerConfig } from 'src/config/multer.config';

@Controller('users')
@UseGuards(AuthenticatedGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('settings/:setting')
  getUserSettings(@Request() req, @Param('setting') setting: string | null) {
    const currentUser = req.user;
    return this.usersService.getUserSettings(currentUser, setting);
  }

  @UseInterceptors(FileInterceptor('profilePicture', multerConfig))
  @Put('settings/update')
  async updateUserSettings(
    @Request() req, 
    @Body() updates: SettingsUpdateDto,
    @UploadedFile()
    profilePicture: Express.Multer.File,
  ) {

    const currentUser = req.user;

    updates.settings = updates.settings ? JSON.parse(updates.settings) : [];

    if (Array.isArray(updates.settings) && profilePicture) {
      updates.settings.push({ key: 'transferProfilePicture', value: profilePicture });
    }

    return this.usersService.updateUserSettings(currentUser, updates, profilePicture);
  }

}
