import { Module } from '@nestjs/common';
import { BalanceService } from './service/balance.service';
import { BalanceController } from './controller/balance.controller';
import { PrismaService } from '../prisma.service';
import {UserService} from '../users/service/user.service';
import {UserDto} from '../users/dto/user.dto';
import {JwtStrategy} from '../auth/jwt.strategy';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [BalanceService,PrismaService,UserService,UserDto,JwtService,JwtStrategy],
  controllers: [BalanceController]
})
export class BalanceModule {}
