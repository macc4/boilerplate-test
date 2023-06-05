import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';

import { Order, PaginatedResponse } from '../../common/types';
import { ImageModel } from './image.model';
import {
  UploadImageDto,
  GetImageFeedQuery,
  ImageFeedObject,
} from './images.dto';
import { ImagesRepository } from './images.repository';
import { PortfoliosService } from '../portfolios/portfolios.service';
import { AWSService } from '../shared/aws/aws.service';

@Injectable()
export class ImagesService {
  constructor(
    private readonly repository: ImagesRepository,
    private readonly portfoliosService: PortfoliosService,
    private readonly awsService: AWSService,
  ) {}

  async uploadImage(
    userId: number,
    image: Express.Multer.File,
    data: UploadImageDto,
  ): Promise<ImageModel> {
    const portfolio = await this.portfoliosService.findOne({
      userId,
      id: data.portfolioId,
    });

    const fileName = `${randomUUID()}-${image.originalname}`;

    const location = await this.awsService.uploadImage(image.buffer, fileName);

    const uploadedImage = await this.repository.create({
      ...data,
      url: location,
      portfolioId: portfolio.id,
    });

    return uploadedImage;
  }

  async getImageFeed(
    query: GetImageFeedQuery,
  ): Promise<PaginatedResponse<ImageFeedObject>> {
    const {
      sortBy = 'createdAt',
      order = Order.DESC,
      limit = 10,
      offset = 0,
    } = query;

    const { images, total } = await this.repository.getImageFeed({
      sortBy,
      order,
      limit,
      offset,
    });

    const formattedImages = images.map(
      ({ id, name, description, url, portfolio, createdAt }) => ({
        id,
        name,
        description,
        url,
        portfolioName: portfolio.name,
        createdAt,
      }),
    );

    return {
      data: formattedImages,
      limit,
      offset,
      total,
    };
  }

  async findOne(where: Partial<ImageModel>): Promise<ImageModel> {
    const portfolio = await this.repository.findOne(where);

    if (!portfolio) {
      throw new NotFoundException();
    }

    return portfolio;
  }

  async deleteById(
    id: number,
    portfolioId: number,
    userId: number,
  ): Promise<void> {
    const portfolio = await this.portfoliosService.findOne({
      id: portfolioId,
      userId,
    });

    const images = await this.repository.delete({
      id,
      portfolioId: portfolio.id,
    });

    if (!images.length) {
      throw new NotFoundException();
    }
  }

  async deleteBulkByPortfolioId(portfolioId: number): Promise<void> {
    await this.repository.delete({ portfolioId });
  }
}
