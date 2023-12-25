
import {
    Controller,
    Get,
    Param,
    Post,
    Body,
    Put,
    Delete,
    Res,
    UseGuards,
    Req,
    HttpStatus
  } from '@nestjs/common';
  import { Response } from 'express';
  import { UserService } from '../service/user.service';
  // import { user } from '@prisma/client';
  import * as bcrypt from 'bcrypt';
  import { JwtService } from '@nestjs/jwt';
  import { AuthService } from '../../auth/service/auth.service';
  import {AuthDto} from "../../auth/dto/auth.dto";
  import {JwtAuthGuard} from '../../auth/jwt-auth.guard';
  
  @Controller('user')
  export class UserController {
    constructor(private readonly userService: UserService,private readonly authService: AuthService, private jwtService: JwtService) {}
    // @Get()
    // async getAllUser(): Promise<user[]> {
    //   return this.userService.getAllUser();
    // }
    @Post()
    async createUser(
      // @Body() postData: user
      // @Body('password') password: string,
      // @Body('username') username: string,
    // ): Promise<user> {
      @Body() { username, password }: AuthDto,
      @Res() res: Response
    ) {
        let checkUser = await this.authService.validateUser(username,password)
        if(checkUser !== null){
          return res.status(HttpStatus.CONFLICT).send({
            message: 'user already exist',
            data: ''
          })
        }
        const saltOrRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltOrRounds);
        const result = await this.userService.createUser(username,hashedPassword);
        if(result){
          let payload = { sub: {id:result.id,username:result.username} };
          return res.status(HttpStatus.CREATED).send({
            token : this.jwtService.sign(payload)
          })
        }else{
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            message: 'something went wrong',
            data : ''
          })
        }
    // return result;
      // return this.userService.createUser(postData);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async getUser(
      @Req() request: Request,
      @Res() res: Response) {
        let userData = request["user"].sub
        let resultService = await this.userService.getUser(userData?.username)
        let new_resultService = {
          id: resultService?.id,
          username: resultService?.username
        }
        return res.status(HttpStatus.OK).send(new_resultService);
    }

    // @Get(':username')
    // async getUser(@Param('username') username: string): Promise<user | null> {
    //   return this.userService.getUser(username);
    // }
    // @Put(':id')
    // async Update(@Param('id') id: number, data:user): Promise<user> {
    //   return this.userService.updateUser(id,data);
    // }
    // @Delete(':id')
    // async Delete(@Param('id') id: number): Promise<user> {
    //   return this.userService.deleteUser(id);
    // }
  }