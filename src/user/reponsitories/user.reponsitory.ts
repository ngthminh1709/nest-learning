import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Request, response, Response } from 'express';
import { Model } from 'mongoose';
import { CreateUserDto, JwtPayload, LoginUserDto } from '../dto/user.dto';
import { User } from '../models/user.model';

@Injectable()
export class UserReponsitory {
  constructor(
    @InjectModel('User')
    private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async getUserById(id: any) {
    const user = await this.userModel.findById(id);

    if (!user) throw new HttpException('User not found!', HttpStatus.NOT_FOUND);

    return {
      user: user,
    };
  }

  async register(createUserDto: CreateUserDto) {
    try {
      const currentUser = await this.userModel
        .findOne({
          email: createUserDto.email,
        })
        .exec();

      if (currentUser)
        throw new HttpException(
          `${currentUser.email} is already registered!`,
          HttpStatus.CONFLICT,
        );

      const hashPassword = await bcrypt.hash(createUserDto.password, 10);

      await this.userModel.create({
        email: createUserDto.email,
        username: createUserDto.username,
        password: hashPassword,
      });
      return { success: true, message: 'Register Successfully!' };
    } catch (err) {
      console.log(err);
      throw new HttpException(err.response, err.status);
    }
  }

  async login(loginUserDto: LoginUserDto, res: Response) {
    try {
      const currentUser = await this.userModel
        .findOne({
          email: loginUserDto.email,
        })
        .lean();

      if (!currentUser)
        throw new HttpException(
          'Email is not registered!',
          HttpStatus.NOT_FOUND,
        );

      const passwordChecker = await bcrypt.compare(
        loginUserDto.password,
        currentUser.password,
      );

      if (!passwordChecker)
        throw new HttpException(
          'Wrong email or password!',
          HttpStatus.UNAUTHORIZED,
        );

      const tokens = await this._createToken(currentUser);
      const loggedUser = await this.userModel.findByIdAndUpdate(
        currentUser._id,
        {
          $set: { refreshToken: tokens.refreshToken },
        },
        { new: true, select: '-password' },
      );

      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: false,
        path: '/',
        sameSite: 'strict',
      });

      return { success: true, user: loggedUser, acessToken: tokens.acessToken };
    } catch (err) {
      console.log(err);
      throw new HttpException(err.response, err.status);
    }
  }

  async logout(res: Response, req: Request) {
    try {
      const refreshToken = req?.cookies?.refreshToken;

      if (!refreshToken)
        throw new HttpException(
          'RefreshToken is not valid!',
          HttpStatus.NOT_FOUND,
        );

      const { id, role } = <JwtPayload>(
        await this.jwtService.decode(refreshToken)
      );

      await this.userModel.findByIdAndUpdate(id, {
        $set: { refreshToken: '' },
      });

      await res.cookie('refreshToken', '', {
        maxAge: -1,
        path: '/',
      });

      return { success: true, message: 'Logged out!' };
    } catch (err) {
      console.log(err);
      throw new HttpException(err.response, err.status);
    }
  }

  async getRefreshToken(req: Request, res: Response) {
    try {
      const refreshToken = await req?.cookies?.refreshToken;
      const currentUser = await this.userModel
        .findOne({ refreshToken: refreshToken })
        .exec();

      if (!refreshToken || !currentUser)
        throw new HttpException(
          'RefreshToken is not valid!',
          HttpStatus.NOT_FOUND,
        );

      await this.jwtService.verify(refreshToken, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      });

      const tokens = await this._createToken(currentUser);
      console.log(tokens);
      const loggedUser = await this.userModel.findByIdAndUpdate(
        currentUser._id,
        {
          $set: { refreshToken: tokens.refreshToken },
        },
        { new: true, select: '-password' },
      );

      await res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: false,
        path: '/',
        sameSite: 'strict',
      });

      return { success: true, user: loggedUser, acessToken: tokens.acessToken };
    } catch (err) {
      console.log(err);
      throw new HttpException(err.response, err.status);
    }
  }

  private _createToken(user: any): any {
    const acessToken = this.jwtService.sign(
      {
        id: user._id,
        role: user.role,
      },
      {
        secret: process.env.ACESS_TOKEN_SECRET,
        expiresIn: '1d',
      },
    );

    const refreshToken = this.jwtService.sign(
      {
        id: user._id,
        role: user.role,
      },
      {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: '1d',
      },
    );

    return {
      acessToken,
      refreshToken,
    };
  }
}
