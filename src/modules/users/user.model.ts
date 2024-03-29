import { ApiProperty } from '@nestjs/swagger';
import {
  AllowNull,
  AutoIncrement,
  Column,
  Default,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';

@Table({
  tableName: 'users',
})
export class UserModel extends Model<UserModel> {
  @ApiProperty()
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ApiProperty()
  @Unique
  @Column
  username: string;

  @Column
  password: string;

  @ApiProperty()
  @Default(() => new Date())
  @Column({ field: 'created_at' })
  createdAt: Date;

  @ApiProperty()
  @AllowNull
  @Column({ field: 'deleted_at' })
  deletedAt: Date;
}
