import { Injectable } from '@nestjs/common';
import { UserReponsitory } from '../reponsitories/user.reponsitory';

@Injectable()
export class AuthService {
  constructor(private readonly userReponsitory: UserReponsitory) {}

  async register(createUserDto: any) {
    return this.userReponsitory.register(createUserDto);
  }

  async login(loginUserDto: any, res: any) {
    return this.userReponsitory.login(loginUserDto, res);
  }

  async logout(res: any, req: any) {
    return this.userReponsitory.logout(res, req);
  }

  async getRefreshToken(req: any, res: any) {
    return this.userReponsitory.getRefreshToken(req, res);
  }
}
