import {PassportSerializer} from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class SessionSerializer extends PassportSerializer {
    constructor(private readonly usersService: UsersService) {
        super();
    }

    serializeUser(user: User, done: (err: Error | null, userId: any) => void): any {
        done(null, user._id);
    }


    async deserializeUser(payload: any, done: (err: Error | null, user: User | null) => void): Promise<any> {
        const user = await this.usersService.findOneById(payload);

        if (!user) {
            // User not found, clear the session.
            return done(null, null);
        }
        done(null, user); 
    }
}