import { Injectable } from '@nestjs/common';
// import { PrismaService } from '../../prisma.service';
import { Prisma,PrismaClient } from '@prisma/client';
import {UserService} from '../../users/service/user.service'
// import {UserDto} from '../../users/dto/user.dto'

const prismaTrx = new PrismaClient()

@Injectable()
export class BalanceService {
    constructor(private readonly usersService: UserService) {}

    async getBalance(username: string): Promise<any> {
        const userDt = await this.usersService.getUser(username);
        if(typeof(userDt.id) !== "undefined"){
            return {balance: userDt.balance.toString()}
        }else{
            return 'fail get user balance'
        }
    }
}
