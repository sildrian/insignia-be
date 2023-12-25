import { Injectable, NotAcceptableException,Inject,forwardRef } from '@nestjs/common';
import { UserService } from '../../users/service/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthEntity } from "../entity/auth.entity";
// import { jwtSecret } from '../auth.module';


@Injectable()
export class AuthService {
    constructor(
        // @Inject(forwardRef(() => UserService))
        // @Inject(forwardRef(() => JwtService))
        private readonly usersService: UserService, private jwtService: JwtService
    ) { }

    validateToken(token: string) {
        return this.jwtService.verify(token, {
            secret : process.env.jwtSecret
            // secret: env("jwtSecret")
        });
    }

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.usersService.getUser(username);
        if (!user) return null;
        const passwordValid = await bcrypt.compare(password, user.password)
        if (!user) {
            throw new NotAcceptableException('could not find the user');
        }
        if (user && passwordValid) {
            return user;
        }
        return null;
    }
    
    async login(username: string, password: string): Promise<AuthEntity> {
        let checkUser = await this.validateUser(username,password)
        if(checkUser === null){
            return null;
        }
        // const payload = { username: checkUser?.username, sub: checkUser?.id };
        const payload = {sub: {id:checkUser?.id,username:checkUser?.username}}
        return {token: this.jwtService.sign(payload)}
    }
}
