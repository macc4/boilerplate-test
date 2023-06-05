import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsString, IsNotEmpty, IsOptional } from 'class-validator';

import {
  AbstractPaginationOptions,
  PaginationOptions,
} from '../../common/types';

export class CreatePortfolioDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;
}

const portfolioSortValues = ['createdAt'] as const;

export type PortfolioSortByValues = typeof portfolioSortValues[number];

export class GetPortfoliosQuery
  extends PaginationOptions
  implements AbstractPaginationOptions<PortfolioSortByValues>
{
  @ApiPropertyOptional({ type: String })
  @IsIn(portfolioSortValues)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  sortBy?: PortfolioSortByValues;

  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;
}
