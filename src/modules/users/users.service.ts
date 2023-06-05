import { Injectable, NotFoundException } from '@nestjs/common';
import { Transaction } from 'sequelize';

import { UserModel } from './user.model';
import { UsersRepository } from './users.repository';
import { UsersEventsPublisher } from './events/users-events.publisher';

@Injectable()
export class UsersService {
  constructor(
    private readonly repository: UsersRepository,
    private readonly usersEventsPublisher: UsersEventsPublisher,
  ) {}

  async createUser(
    data: Partial<UserModel>,
    transaction?: Transaction,
  ): Promise<UserModel> {
    const user = await this.repository.create(data, transaction);

    return user;
  }

  async getMyProfile(userId: number): Promise<UserModel> {
    const userRecord = await this.findOne({ id: userId });

    const { ...user } = userRecord.dataValues;

    delete user.password;

    return UserModel.build(user);
  }

  async findOne(where: Partial<UserModel>): Promise<UserModel> {
    const user = await this.repository.findOne(where);

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async deleteById(id: number): Promise<void> {
    const user = await this.repository.deleteById(id);

    if (!user) {
      throw new NotFoundException();
    }

    this.usersEventsPublisher.delete({ userId: id });
  }
}
