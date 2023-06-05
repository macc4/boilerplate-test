import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';

import { UserModel } from './user.model';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(UserModel)
    private readonly userModel: typeof UserModel,
  ) {}

  async create(
    data: Partial<UserModel>,
    transaction?: Transaction,
  ): Promise<UserModel> {
    const user = await this.userModel.create(
      {
        ...data,
      },
      { returning: true, transaction },
    );

    return user;
  }

  async findOne(where: Partial<UserModel>): Promise<UserModel> {
    const user = await this.userModel.findOne({
      where,
    });

    return user;
  }

  async updateOne(
    data: Partial<UserModel>,
    where: Partial<UserModel>,
    transaction?: Transaction,
  ): Promise<UserModel> {
    const updatedRecord = await this.userModel.update(data, {
      where,
      returning: true,
      transaction,
    });

    return updatedRecord[1][0];
  }
}
