import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CreateUserDto, LoginUserDto } from '../dto/user.dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('/login')
  @HttpCode(HttpStatus.CREATED)
  login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(loginUserDto, res);
  }

  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) res: Response, @Req() req: Request) {
    return this.authService.logout(res, req);
  }

  @Post('/get-refresh-token')
  @HttpCode(HttpStatus.CREATED)
  getRefreshToken(@Res({ passthrough: true }) res: Response, @Req() req: Request) {
    return this.authService.getRefreshToken(req, res);
  }
}
