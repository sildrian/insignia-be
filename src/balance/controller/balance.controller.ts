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
    BadGatewayException
  } from '@nestjs/common';
  import { Response } from 'express';
    import {JwtAuthGuard} from '../../auth/jwt-auth.guard';
  // import {BalanceDto} from '../dto/balance.dto';
  import {BalanceService} from '../service/balance.service';
  // import { JwtService } from '@nestjs/jwt';
    // import { JwtPayload } from 'jsonwebtoken';
  // import {JwtStrategy} from '../../auth/jwt.strategy'


@Controller('balance')
export class BalanceController {
    constructor(private readonly balanceService: BalanceService) {}
    @Get()
    @UseGuards(JwtAuthGuard)
    async getBalance(
        @Req() request: Request,
        @Res() res: Response
    ) {
        let userData = request["user"].sub
        let resultService = await this.balanceService.getBalance(userData?.username)
        if(resultService === 'fail get user balance'){
          throw new BadGatewayException;
        }else{
          return res.status(HttpStatus.OK).send(resultService)
        }
    }
}