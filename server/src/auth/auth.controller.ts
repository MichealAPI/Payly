import {Controller, Post, UseGuards, Request, Get, Session, Body} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { LocalAuthGuard } from './guards/local.auth.guard';


@Controller('auth')
export class AuthController {

    constructor(private readonly usersService: UsersService) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    login(@Request() req) {
        return req.user;
    }

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @UseGuards(AuthenticatedGuard)
    @Get('logout')
    logout(@Session() session) {
        session.destroy();
        return { message: 'Logged out successfully' };
    }

    @UseGuards(AuthenticatedGuard)
    @Get('profile')
    getProfile(@Request() req) {
        console.log('Current user:', req.user);
        return req.user;
    }

}