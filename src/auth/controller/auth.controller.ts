import { Controller, Request, Body, Post, UseGuards, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from '../service/auth.service';
// import { AuthGuard } from '@nestjs/passport';
import {AuthDto} from "../dto/auth.dto";

@Controller('login')
export class AuthController {
    constructor(private authService: AuthService) { }

    // @UseGuards(AuthGuard('local'))
    // @Post('auth/login')
    @Post()
    // async login(@Request() req) {
    async login(@Body() { username, password }: AuthDto,  @Res() res: Response){
        // return this.authService.login(username, password);
        let result = await this.authService.login(username,password);
        if(result === null){
            return res.status(HttpStatus.BAD_REQUEST).send({
                message: "username or password is wrong"
            })
        }else{
            return res.status(HttpStatus.OK).send(
                result
            )
        }
    }
}
