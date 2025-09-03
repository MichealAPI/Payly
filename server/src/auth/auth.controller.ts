import {Controller, Post, UseGuards, Request, Get, Session, Body, Req, BadRequestException} from '@nestjs/common';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { createRemoteJWKSet, jwtVerify, JWTPayload } from 'jose';
import { LocalAuthGuard } from './guards/local.auth.guard';


@Controller('auth')
export class AuthController {

    constructor(private readonly usersService: UsersService, private readonly config: ConfigService) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    login(@Request() req) {
        return {
            user: req.user,
            sessionId: req.sessionID,
            expiresAt: req.session.cookie.expires
        }; 
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
        return req.user;
    }

    @UseGuards(AuthenticatedGuard)
    @Post("signout")
    signout(@Session() session) {
        session.destroy();
        return { message: 'Signed out successfully' };
    }

    @Post('google')
    async googleLogin(@Body() body: { idToken: string }, @Request() req) {
        const { idToken } = body || {};
        if (!idToken) throw new BadRequestException('idToken required');
        const googleClientId = this.config.get<string>('GOOGLE_CLIENT_ID');
        try {
            // Verify token with Google
            const ticket = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`);
            const data = ticket.data;
            if (googleClientId && data.aud !== googleClientId) {
                throw new BadRequestException('Invalid audience');
            }
            const profile = {
                sub: data.sub,
                email: data.email,
                given_name: data.given_name,
                family_name: data.family_name,
            };
            const user = await this.usersService.findOrCreateGoogle(profile);
            // establish session
            req.login(user, (err) => { if (err) throw err; });
            return { user, sessionId: req.sessionID, expiresAt: req.session.cookie.expires };
        } catch (e: any) {
            throw new BadRequestException('Google token invalid');
        }
    }

    @Post('apple')
    async appleLogin(@Body() body: { identityToken: string }, @Request() req) {
        const { identityToken } = body || {};
        if (!identityToken) throw new BadRequestException('identityToken required');
        try {
            const appleAud = this.config.get<string>('APPLE_CLIENT_ID');
            const JWKS = createRemoteJWKSet(new URL('https://appleid.apple.com/auth/keys'));
            const { payload } = await jwtVerify(identityToken, JWKS, {
                issuer: 'https://appleid.apple.com',
                audience: appleAud ? [appleAud] : undefined,
            });
            const profile = {
                sub: payload.sub as string,
                email: (payload as JWTPayload & { email?: string }).email,
                given_name: (payload as any).given_name,
                family_name: (payload as any).family_name,
            };
            const user = await this.usersService.findOrCreateApple(profile);
            req.login(user, (err) => { if (err) throw err; });
            return { user, sessionId: req.sessionID, expiresAt: req.session.cookie.expires };
        } catch (e) {
            throw new BadRequestException('Apple token invalid');
        }
    }

    @Post('facebook')
    async facebookLogin(@Body() body: { accessToken: string }, @Request() req) {
        const { accessToken } = body || {};
        if (!accessToken) throw new BadRequestException('accessToken required');
        try {
            const fbAppId = this.config.get<string>('FACEBOOK_APP_ID');
            const fbAppSecret = this.config.get<string>('FACEBOOK_APP_SECRET');
            if (fbAppId && fbAppSecret) {
                // Optional debug to ensure token is valid for this app
                await axios.get(`https://graph.facebook.com/debug_token?input_token=${encodeURIComponent(accessToken)}&access_token=${fbAppId}|${fbAppSecret}`);
            }
            const fields = 'id,email,first_name,last_name';
            const fbRes = await axios.get(`https://graph.facebook.com/me?fields=${fields}&access_token=${encodeURIComponent(accessToken)}`);
            const data = fbRes.data;
            const profile = {
                id: data.id,
                email: data.email,
                first_name: data.first_name,
                last_name: data.last_name,
            };
            const user = await this.usersService.findOrCreateFacebook(profile);
            req.login(user, (err) => { if (err) throw err; });
            return { user, sessionId: req.sessionID, expiresAt: req.session.cookie.expires };
        } catch (e) {
            throw new BadRequestException('Facebook token invalid');
        }
    }

}