import { Injectable, NotFoundException } from '@nestjs/common';

import { Order, PaginatedResponse } from '../../common/types';
import { PortfolioModel } from './portfolio.model';
import { CreatePortfolioDto, GetPortfoliosQuery } from './portfolios.dto';
import { PortfoliosRepository } from './portfolios.repository';

@Injectable()
export class PortfoliosService {
  constructor(private readonly repository: PortfoliosRepository) {}

  async createPortfolio(
    userId: number,
    data: CreatePortfolioDto,
  ): Promise<PortfolioModel> {
    const portfolio = await this.repository.create({ userId, ...data });

    return portfolio;
  }

  async findAllMyPortfolios(
    userId: number,
    query: GetPortfoliosQuery,
  ): Promise<PaginatedResponse<PortfolioModel>> {
    const {
      sortBy = 'createdAt',
      order = Order.ASC,
      limit = 10,
      offset = 0,
      ...rest
    } = query;

    const { portfolios, total } = await this.repository.findAllByUserId(
      { ...rest, userId },
      {
        sortBy,
        order,
        limit,
        offset,
      },
    );

    return {
      data: portfolios,
      limit,
      offset,
      total,
    };
  }

  async findOne(where: Partial<PortfolioModel>): Promise<PortfolioModel> {
    const portfolio = await this.repository.findOne(where);

    if (!portfolio) {
      throw new NotFoundException();
    }

    return portfolio;
  }

  async deleteById(id: number, userId: number): Promise<void> {
    const user = await this.repository.delete({ id, userId });

    if (!user) {
      throw new NotFoundException();
    }
  }

  async deleteBulkByUserId(userId: number): Promise<void> {
    await this.repository.delete({ userId });
  }
}
