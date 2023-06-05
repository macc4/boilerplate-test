import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';

import { UserModel } from './user.model';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(UserModel)
    private readonly model: typeof UserModel,
  ) {}

  async create(
    data: Partial<UserModel>,
    transaction?: Transaction,
  ): Promise<UserModel> {
    const response = await this.model.create(
      {
        ...data,
      },
      { returning: true, transaction },
    );

    return response;
  }

  async findOne(where: Partial<UserModel>): Promise<UserModel> {
    const response = await this.model.findOne({
      where,
    });

    return response;
  }

  async updateOne(
    data: Partial<UserModel>,
    where: Partial<UserModel>,
    transaction?: Transaction,
  ): Promise<UserModel> {
    const response = await this.model.update(data, {
      where,
      returning: true,
      transaction,
    });

    return response[1][0];
  }

  async deleteById(id: number): Promise<number> {
    const response = await this.model.destroy({
      where: { id },
    });

    return response;
  }
}
