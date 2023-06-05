import { ApiProperty } from '@nestjs/swagger';
import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  Default,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { PortfolioModel } from '../portfolios/portfolio.model';
import { CommentModel } from '../comments/comment.model';

@Table({
  tableName: 'images',
})
export class ImageModel extends Model<ImageModel> {
  @ApiProperty()
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ApiProperty()
  @ForeignKey(() => PortfolioModel)
  @Column({ field: 'portfolio_id' })
  portfolioId: number;

  @ApiProperty()
  @Column
  name: string;

  @ApiProperty()
  @Column
  description: string;

  @ApiProperty()
  @Column
  url: string;

  @ApiProperty()
  @Default(() => new Date())
  @Column({ field: 'created_at' })
  createdAt: Date;

  @ApiProperty()
  @AllowNull
  @Column({ field: 'deleted_at' })
  deletedAt: Date;

  @BelongsTo(() => PortfolioModel)
  portfolio: PortfolioModel;

  @HasMany(() => CommentModel)
  comments: CommentModel[];
}
