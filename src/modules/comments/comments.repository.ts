import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';

import { CommentModel } from './comment.model';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(CommentModel)
    private readonly model: typeof CommentModel,
  ) {}

  async create(
    data: Partial<CommentModel>,
    transaction?: Transaction,
  ): Promise<CommentModel> {
    const response = await this.model.create(
      {
        ...data,
      },
      { returning: true, transaction },
    );

    return response;
  }

  async delete(where: Partial<CommentModel>): Promise<CommentModel[]> {
    const deletedImages = this.model.findAll({ where });

    await this.model.destroy({
      where,
    });

    return deletedImages;
  }
}
