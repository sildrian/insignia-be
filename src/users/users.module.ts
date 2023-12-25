import { Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { UserController } from './controller/user.controller';
import { PrismaService } from '../prisma.service';
import {AuthService} from "../auth/service/auth.service";
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../auth/jwt.strategy';
import { JwtService } from '@nestjs/jwt';

export const jwtSecret = 'zjP9h6ZI5LoSKCRj';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtSecret,
      signOptions: { expiresIn: '5m' }, // e.g. 30s, 7d, 24h
    }),
  ],
  providers: [UserService, AuthService, PrismaService,JwtService,JwtStrategy],
  controllers: [UserController],
  exports: [UserService],
})
export class UsersModule {}
