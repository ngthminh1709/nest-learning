import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt/dist';
import { AuthController } from './controller/auth.controller';
import { UserController } from './controller/user.controller';
import { UserSchema } from './models/user.model';
import { UserReponsitory } from './reponsitories/user.reponsitory';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { LoginGuard } from './reponsitories/guards/login.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
      },
    ]),
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'auth, user',
      session: false,
    }),
    JwtModule.register({
      secret: 'secret',
    }),
  ],
  controllers: [UserController, AuthController],
  providers: [UserService, AuthService, UserReponsitory, LoginGuard],
})
export class UserModule {}
