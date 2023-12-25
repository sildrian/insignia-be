import {
    Controller,
    Get,
    Param,
    Post,
    Body,
    Put,
    Delete,
    Res,
    HttpStatus,
    UseGuards,
    Req,
    // InternalServerErrorException,
    BadGatewayException,
    Query
  } from '@nestjs/common';
  import { Response } from 'express';
    import {JwtAuthGuard} from '../../auth/jwt-auth.guard';
  import {TransferDto} from '../dto/transfer.dto';
  import {TopupDto} from '../dto/topup.dto'
  import {TransactionService} from '../service/transaction.service';
//   import { JwtService } from '@nestjs/jwt';
    // import { JwtPayload } from 'jsonwebtoken';
//   import {JwtStrategy} from '../../auth/jwt.strategy'
import { TopTransactionDto } from '../dto/top_transaction.dto';


@Controller()
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) {}
    @Post('topup')
    @UseGuards(JwtAuthGuard)
    async topupBalance(
        @Req() request: Request,
        @Body() { amount }: TopupDto,
        @Res() res: Response
    ) {
        let userData = request["user"].sub
        let resultService = await this.transactionService.topup(userData?.id,amount,userData?.username)
        if(resultService !== true){
          throw new BadGatewayException;
        }else{
          return res.status(HttpStatus.NO_CONTENT).send()
        }
    }

    @Post('transfer')
    @UseGuards(JwtAuthGuard)
    async transferBalance(
        @Req() request: Request,
        @Body() { to_username, amount }: TransferDto,
        @Res() res: Response
    ) {
        let userData = request["user"].sub
        let resultService = await this.transactionService.transfer(userData?.id,amount,userData?.username,to_username)
        if(resultService === "Destination user not found"){
          return res.status(HttpStatus.BAD_REQUEST).send({message:resultService})
        }
        else if(resultService === 'your balance not enough'){
          return res.status(HttpStatus.BAD_REQUEST).send({message:resultService})
        }
        else if(resultService === `cannot debit to balance history`){
          throw new BadGatewayException;
        }else{
          return res.status(HttpStatus.NO_CONTENT).send()
        }
    }

    @Get('top_transaction_per_user')
    @UseGuards(JwtAuthGuard)
    async topTransaction(
        @Req() request: Request,
        @Res() res: Response
    ) {
        let userData = request["user"].sub
        let resultService = await this.transactionService.topTransaction(userData?.id)
        return res.status(HttpStatus.OK).send(resultService)   
    }

    @Get('top_users')
    @UseGuards(JwtAuthGuard)
    async topTransactionByValue(
        @Req() request: Request,
        @Res() res: Response
    ) {
        let userData = request["user"].sub
        let resultService = await this.transactionService.topTransactionByValue(userData?.id)
        return res.status(HttpStatus.OK).send(resultService)   
    }

    @Get('top_transaction_per_user_pagination')
    @UseGuards(JwtAuthGuard)
    async topTransactionPagination(
        @Req() request: Request,
        @Query() query: TopTransactionDto,
        @Res() res: Response
    ) {
        let userData = request["user"].sub
        let resultService = await this.transactionService.topTransactionPagination(userData?.id,query.username,query.amount_filter,query.limit,query.offset)
        return res.status(HttpStatus.OK).send(resultService)   
    }
}

