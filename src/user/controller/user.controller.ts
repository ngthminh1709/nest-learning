import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { LoginGuard } from '../reponsitories/guards/login.guard';
import { UserService } from '../services/user.service';

@Controller('user')
@UseGuards(LoginGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getUserById(@Param('id') id: any) {
    return this.userService.getUserById(id);
  }
}
