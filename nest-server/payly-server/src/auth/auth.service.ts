import {Injectable} from '@nestjs/common';
import {UsersService} from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByEmail(email);

        if (user && user.password) {
            const isMatch = await bcrypt.compare(pass, user.password);

            if (isMatch) {
                // Return user data without password
                const { password, ...result } = user.toObject();
                return result;
            }
        }

        return null;
    }
}