import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Transaction, WhereOptions } from 'sequelize';

import { PortfolioModel } from './portfolio.model';
import { PortfolioSortByValues } from './portfolios.dto';
import { AbstractPaginationOptions } from '../../common/types';

@Injectable()
export class PortfoliosRepository {
  constructor(
    @InjectModel(PortfolioModel)
    private readonly model: typeof PortfolioModel,
  ) {}

  async create(
    data: Partial<PortfolioModel>,
    transaction?: Transaction,
  ): Promise<PortfolioModel> {
    const response = await this.model.create(
      {
        ...data,
      },
      { returning: true, transaction },
    );

    return response;
  }

  async findAllByUserId(
    { userId, name }: Partial<PortfolioModel>,
    options?: AbstractPaginationOptions<PortfolioSortByValues>,
  ): Promise<{ portfolios: PortfolioModel[]; total: number }> {
    const { sortBy, order, limit, offset } = options;

    const where: WhereOptions<PortfolioModel> = { userId };

    if (name) {
      where.name = { [Op.iLike]: `${name}%` };
    }

    const { rows: portfolios, count: total } = await this.model.findAndCountAll(
      {
        where,
        order: [[sortBy, order]],
        limit,
        offset,
      },
    );

    return { portfolios, total };
  }

  async findOne(where: Partial<PortfolioModel>): Promise<PortfolioModel> {
    const response = await this.model.findOne({
      where,
    });

    return response;
  }

  async updateOne(
    data: Partial<PortfolioModel>,
    where: Partial<PortfolioModel>,
    transaction?: Transaction,
  ): Promise<PortfolioModel> {
    const response = await this.model.update(data, {
      where,
      returning: true,
      transaction,
    });

    return response[1][0];
  }

  async delete(where: Partial<PortfolioModel>): Promise<PortfolioModel[]> {
    const deletedImages = this.model.findAll({ where });

    await this.model.destroy({
      where,
    });

    return deletedImages;
  }
}
