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
import { ImageModel } from '../images/image.model';
import { UserModel } from '../users/user.model';

@Table({
  tableName: 'comments',
})
export class CommentModel extends Model<CommentModel> {
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
  @ForeignKey(() => ImageModel)
  @Column({ field: 'image_id' })
  imageId: number;

  @ApiProperty()
  @Column
  text: string;

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

  @BelongsTo(() => ImageModel)
  image: ImageModel;
}
