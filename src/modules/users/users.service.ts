import { Injectable, NotFoundException } from '@nestjs/common';
import { Transaction } from 'sequelize';

import { UserModel } from './user.model';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(
    data: Partial<UserModel>,
    transaction?: Transaction,
  ): Promise<UserModel> {
    const user = await this.usersRepository.create(data, transaction);

    return user;
  }

  async findOne(where: Partial<UserModel>): Promise<UserModel> {
    const user = await this.usersRepository.findOne(where);

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }
}
