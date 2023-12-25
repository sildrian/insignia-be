import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { TransactionModule } from './transaction/transaction.module';
// import { BalanceModule } from './balance/balance.module'
import { BalanceModule } from './balance/balance.module';

@Module({
  imports: [UsersModule, AuthModule, PrismaModule, TransactionModule, BalanceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
