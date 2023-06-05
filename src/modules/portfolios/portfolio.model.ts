import { ApiProperty } from '@nestjs/swagger';
import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { UserModel } from '../users/user.model';

@Table({
  tableName: 'portfolios',
})
export class PortfolioModel extends Model<PortfolioModel> {
  @ApiProperty()
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ApiProperty()
  @ForeignKey(() => UserModel)
  @Column({ field: 'user_id' })
  userId: number;

  @ApiProperty()
  @Column
  name: string;

  @ApiProperty()
  @Column
  description: string;

  @ApiProperty()
  @Default(() => new Date())
  @Column({ field: 'created_at' })
  createdAt: Date;

  @ApiProperty()
  @AllowNull
  @Column({ field: 'deleted_at' })
  deletedAt: Date;

  @BelongsTo(() => UserModel)
  user: UserModel;
}
