import { Module, forwardRef } from '@nestjs/common';
import { UsersModule } from "../users/users.module";
import { AuthService } from "./service/auth.service"
import { PassportModule } from "@nestjs/passport"
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controller/auth.controller';
import { UserService } from "../users/service/user.service";
import { PrismaModule } from '../prisma/prisma.module';
// import { MongooseModule } from "@nestjs/mongoose"
// import { UserSchema } from "../user/user.model"
import { LocalStrategy } from './local.auth';
import { PrismaService } from '../prisma.service';
import {JwtStrategy} from "../auth/jwt.strategy";

// export const jwtSecret = 'zjP9h6ZI5LoSKCRj';

@Module({
    // imports: [UsersModule, PassportModule, JwtModule.register({
    //     secret: 'secretKey',
    //     signOptions: { expiresIn: '60s' },
    // //   }), MongooseModule.forFeature([{ name: "user", schema: UserSchema }])],
    // })],
    
    imports: [
        // forwardRef(() => UsersModule),
        // forwardRef(() => PrismaModule),
        // forwardRef(() => PassportModule),
        // forwardRef(() => JwtModule.register({
        //   secret: jwtSecret,
        //   signOptions: { expiresIn: '5m' }, // e.g. 30s, 7d, 24h
        // })),
        UsersModule,
        PrismaModule,
        PassportModule,
        JwtModule.register({
          secret: process.env.jwtSecret,
          signOptions: { expiresIn: '25m' }, // e.g. 30s, 7d, 24h
        }),
      ],
    providers: [AuthService, UserService, LocalStrategy, PrismaService, JwtStrategy],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {}
