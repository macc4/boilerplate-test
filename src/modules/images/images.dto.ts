import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsIn,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
} from 'class-validator';

import {
  AbstractPaginationOptions,
  PaginationOptions,
} from '../../common/types';
import { Type } from 'class-transformer';

export class UploadImageDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  portfolioId: number;
}

export const uploadImageSchema = {
  schema: {
    type: 'object',
    required: ['image', 'name', 'description', 'portfolioId'],
    properties: {
      image: {
        type: 'string',
        format: 'binary',
        description: 'Image to upload to AWS.',
      },
      name: {
        type: 'string',
        description: 'Name of the image.',
      },
      description: {
        type: 'string',
        description: 'Description of the image.',
      },
      portfolioId: {
        type: 'number',
        description: 'Portfolio id.',
      },
    },
  },
};

const imageSortValues = ['createdAt'] as const;

export type ImageSortByValues = typeof imageSortValues[number];

export class GetImageFeedQuery
  extends PaginationOptions
  implements AbstractPaginationOptions<ImageSortByValues>
{
  @ApiPropertyOptional({ type: String })
  @IsIn(imageSortValues)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  sortBy?: ImageSortByValues;
}

export class ImageFeedObject {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  portfolioName: string;

  @ApiProperty()
  createdAt: Date;
}

export class DeleteImageDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  portfolioId: number;
}
