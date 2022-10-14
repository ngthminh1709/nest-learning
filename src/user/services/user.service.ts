import { Injectable } from '@nestjs/common';
import { UserReponsitory } from '../reponsitories/user.reponsitory';

@Injectable()
export class UserService {
  constructor(private readonly userReponsitory: UserReponsitory) {}

  async getUserById(id: any) {
    return this.userReponsitory.getUserById(id);
  }
}
