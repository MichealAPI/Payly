import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { SessionSerializer } from './strategies/session.serializer';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        UsersModule,
        ConfigModule,
        //PassportModule.register({session: true})
    ],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, SessionSerializer],//, LocalStrategy, SessionSerializer],
    exports: [AuthService]
})
export class AuthModule {}