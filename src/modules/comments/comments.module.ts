import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { CommentModel } from './comment.model';
import { CommentsController } from './comments.controller';
import { CommentsRepository } from './comments.repository';
import { CommentsService } from './comments.service';
import { ImagesModule } from '../images/images.module';

@Module({
  imports: [SequelizeModule.forFeature([CommentModel]), ImagesModule],
  controllers: [CommentsController],
  providers: [CommentsService, CommentsRepository],
  exports: [],
})
export class CommentsModule {}
