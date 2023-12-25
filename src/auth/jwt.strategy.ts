import { Injectable, UnauthorizedException, forwardRef, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
// import { jwtSecret } from './auth.module';
import { UserService } from '../users/service/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    // @Inject(forwardRef(() => UserService))
    private usersService: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.jwtSecret,
    });
  }

  async validate(payload: { username: string }) {
    const user = await this.usersService.getUser(payload.username);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}