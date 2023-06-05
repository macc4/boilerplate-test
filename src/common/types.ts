import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';

export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}

export abstract class AbstractPaginationOptions<T> {
  limit?: number;
  offset?: number;
  order?: Order;
  sortBy?: T;
}

export class PaginationOptions {
  @ApiPropertyOptional()
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  offset?: number;

  @ApiPropertyOptional({ enum: Order })
  @IsEnum(Order)
  @IsOptional()
  order?: Order;
}

export class PaginatedResponse<T, K = object> {
  @ApiProperty({ isArray: true })
  data: T[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  offset: number;

  @ApiPropertyOptional()
  metadata?: K;
}

export class ErrorResponse {
  @ApiProperty()
  message: string;

  @ApiProperty()
  status: number;

  @ApiProperty()
  timestamp: string;

  @ApiProperty()
  path: string;

  @ApiPropertyOptional()
  stack?: string;
}
