import { UsersRepository } from '../repositories/users.repository';
import { User ,UserDocumentType } from '../domain/users-schema';
import { Injectable } from '@nestjs/common';
import {CreateUserInputModelType} from "../types/users.types";




@Injectable()
export class UsersService {
  constructor(
    protected usersRepositories: UsersRepository
  ) {}

  async createUser(
    user: CreateUserInputModelType,
    isReqFromSuperAdmin: boolean,
  ): Promise<UserDocumentType | false> {
    const userEmailEntity: User = await User.createUserEntity(user, isReqFromSuperAdmin);
    const newUser = await this.usersRepositories.createUser(userEmailEntity);
    if (!newUser) {
      return false;
    }
    return newUser;
  }

  async deleteAllData() {
    return await this.usersRepositories.deleteAllData();
  }

  async deleteUser(id: string): Promise<any> {
    return await this.usersRepositories.deleteUser(id);
  }
}
