import { Module } from '@nestjs/common';
import { TransactionService } from './service/transaction.service';
import { TransactionController } from './controller/transaction.controller';
import { PrismaService } from '../prisma.service';
import {UserService} from '../users/service/user.service';
import {UserDto} from '../users/dto/user.dto';
import {JwtStrategy} from '../auth/jwt.strategy';
import { JwtService } from '@nestjs/jwt';
import { TopTransactionDto } from './dto/top_transaction.dto';

@Module({
  providers: [TransactionService,PrismaService,UserService,UserDto,JwtService,JwtStrategy,TopTransactionDto],
  controllers: [TransactionController]
})
export class TransactionModule {}
