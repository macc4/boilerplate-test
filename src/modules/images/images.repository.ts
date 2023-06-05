import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';

import { AbstractPaginationOptions } from '../../common/types';
import { ImageModel } from './image.model';
import { ImageSortByValues } from './images.dto';
import { PortfolioModel } from '../portfolios/portfolio.model';
import { CommentModel } from '../comments/comment.model';

@Injectable()
export class ImagesRepository {
  constructor(
    @InjectModel(ImageModel)
    private readonly model: typeof ImageModel,
  ) {}

  async create(
    data: Partial<ImageModel>,
    transaction?: Transaction,
  ): Promise<ImageModel> {
    const response = await this.model.create(
      {
        ...data,
      },
      { returning: true, transaction },
    );

    return response;
  }

  async getImageFeed(
    options?: AbstractPaginationOptions<ImageSortByValues>,
  ): Promise<{ images: ImageModel[]; total: number }> {
    const { sortBy, order, limit, offset } = options;

    const { rows: images, count: total } = await this.model.findAndCountAll({
      order: [[sortBy, order]],
      limit,
      offset,
      include: [
        {
          model: PortfolioModel,
          where: { deletedAt: null },
        },
      ],
    });

    return { images, total };
  }

  async findOne(where: Partial<ImageModel>): Promise<ImageModel> {
    const response = await this.model.findOne({
      where,
      include: [CommentModel],
    });

    return response;
  }

  async updateOne(
    data: Partial<ImageModel>,
    where: Partial<ImageModel>,
    transaction?: Transaction,
  ): Promise<ImageModel> {
    const response = await this.model.update(data, {
      where,
      returning: true,
      transaction,
    });

    return response[1][0];
  }

  async delete(where: Partial<ImageModel>): Promise<ImageModel[]> {
    const deletedImages = this.model.findAll({ where });

    await this.model.destroy({
      where,
    });

    return deletedImages;
  }
}
