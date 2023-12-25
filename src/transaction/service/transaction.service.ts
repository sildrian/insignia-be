import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Prisma,PrismaClient } from '@prisma/client';
import {UserService} from '../../users/service/user.service'
import {UserDto} from '../../users/dto/user.dto'

const prismaTrx = new PrismaClient()

@Injectable()
export class TransactionService {
    constructor(private prisma: PrismaService, private readonly usersService: UserService, private userDto: UserDto) {}
    
    // async topup1(userid: number,amount: number, username: string): Promise<any> {
    //     let balanceInput: Prisma.balance_historyCreateInput
    //     balanceInput = {
    //         blc_amount: amount,
    //         user_id: userid,
    //         type: "topup",
    //     }
    //     let res = await this.prisma.balance_history.create({
    //         data: balanceInput
    //     });
    //     if(typeof(res.id) !== "undefined"){
    //         const userDt = await this.usersService.getUser(username);
    //         // this.userDto = userDt
    //         this.userDto.balance = userDt.balance + BigInt(amount)
    //         const updateBalnceUser = await this.usersService.updateUser(userid,this.userDto);
    //         if(typeof(updateBalnceUser.id) !== "undefined"){
    //             return true
    //         }else{
    //             return "fail to update user balance"
    //         }
    //     }else{
    //         return 'fail to insert balance history'
    //     }
    // }

    async topup(userid: number,amount: number, username: string): Promise<any> {
        return prismaTrx.$transaction(async (tx) => {
            // 1. insert balance to balance history
            let topupInput: Prisma.transactionCreateInput
            topupInput = {
                amount: BigInt(amount),
                user_id: userid,
                type: "topup",
            }
            let res = await tx.transaction.create({
                data: topupInput
            });
        
            // 2. Verify that the sender's balance didn't go below zero.
            if (typeof(res.id) === "undefined" || res === null) {
            //   throw new Error(`${from} doesn't have enough to send ${amount}`)
                throw new Error(`cannot insert to balance history`)
            }
        
            // 3. Update user balance by amount
            const userDt = await this.usersService.getUser(username);
            await tx.user.update({
                data: {
                    balance: userDt.balance + BigInt(amount)
                },
                where: {
                    id: userid
                }
            })
        
            return true
          })
    }

    async transfer(userid: number,amount: number, username_source: string, username_to: string): Promise<any> {
        return prismaTrx.$transaction(async (tx) => {
            const userTo = await this.usersService.getUser(username_to);
            
            //1. check user destination
            if(userTo === null){
                return "Destination user not found"
            }
            
            //2. check balance if not enough
            const userDt = await this.usersService.getUser(username_source);
            if(userDt.balance - BigInt(amount) < 0){
                // throw new Error(`your balance not enough`)
                return `your balance not enough`
            }

            // 3. do debit from user that transfer
            let trxDebit: Prisma.transactionCreateInput
            trxDebit = {
                amount: BigInt(-amount),
                user_id: userid,
                type: "debit",
                involved_user_id: userTo.id
            }
            let resDebit = await tx.transaction.create({
                data: trxDebit
            });
        
            // 4. Verify that the sender's balance didn't go below zero.
            if (typeof(resDebit.id) === "undefined" || resDebit === null) {
                return `cannot debit to balance history`
            }

            // 5. do credit from user that got transfered
            let trxCredit: Prisma.transactionCreateInput
            trxCredit = {
                amount: BigInt(amount),
                user_id: userTo.id,
                type: "credit",
                involved_user_id: userid
            }
            await tx.transaction.create({
                data: trxCredit
            });
        
            // 6. Update user_source balance by amount
            await tx.user.update({
                data: {
                    balance: userDt.balance - BigInt(amount)
                },
                where: {
                    id: userid
                }
            })

            // 6. Update user_to balance by amount
            await tx.user.update({
                data: {
                    balance: userTo.balance + BigInt(amount)
                },
                where: {
                    id: userTo.id
                }
            })
        
            return true
          })
    }

    async topTransaction(userid: number): Promise<any>{
        return await prismaTrx.$queryRawUnsafe(`select u.username,cast(t.amount as varchar(255)) from "transaction" t 
        left join "user" u on t.involved_user_id = u.id 
        where t.user_id = ${userid} and (t.type = 'credit' or t.type = 'debit') 
        order by t.amount desc`)
    }

    async topTransactionByValue(userid: number): Promise<any>{
        return await prismaTrx.$queryRawUnsafe(`select u.username,cast (sum(t.amount) as varchar(25)) as transacted_value from "transaction" t 
        left join "user" u on t.involved_user_id = u.id 
        where t.user_id = ${userid} and (t.type = 'debit')
        group by u.username 
        order by sum(t.amount) desc `)
    }

    async topTransactionPagination(userid: number, username: string, amount_filter: string, limit: number, offset: number): Promise<any>{
        if(username !== ''){
            return await prismaTrx.$queryRawUnsafe(`select t.id,u.username,cast(t.amount as varchar(255)), 
            (select cast(count(*) as varchar(255)) as total from "transaction" t2 
            left join "user" u2 on t2.involved_user_id = u2.id 
            where t2.user_id = ${userid} and (t2.type = 'credit' or t2.type = 'debit') 
            and u2.username = '${username}') 
            from "transaction" t 
            left join "user" u on t.involved_user_id = u.id 
            where t.user_id = ${userid} and (t.type = 'credit' or t.type = 'debit') 
            and u.username = '${username}'
            group by t.id, u.username, t.amount
            order by t.amount ${amount_filter} 
            limit ${limit} offset ${offset}`)
        }else{
            return await prismaTrx.$queryRawUnsafe(`select t.id,u.username,cast(t.amount as varchar(255)), 
            (select cast(count(*) as varchar(255)) as total from "transaction" t2 
            left join "user" u2 on t2.involved_user_id = u2.id 
            where t2.user_id = ${userid} and (t2.type = 'credit' or t2.type = 'debit'))
            from "transaction" t 
            left join "user" u on t.involved_user_id = u.id 
            where t.user_id = ${userid} and (t.type = 'credit' or t.type = 'debit') 
            group by t.id, u.username, t.amount
            order by t.amount ${amount_filter} 
            limit ${limit} offset ${offset}`)
        }
    }
}
