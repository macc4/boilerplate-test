import { Injectable } from '@nestjs/common';

import { CommentModel } from './comment.model';
import { CommentsRepository } from './comments.repository';
import { CreateCommentDto } from './comments.dto';
import { ImagesService } from '../images/images.service';

@Injectable()
export class CommentsService {
  constructor(
    private readonly repository: CommentsRepository,
    private readonly imagesService: ImagesService,
  ) {}

  async createComment(
    userId: number,
    data: CreateCommentDto,
  ): Promise<CommentModel> {
    await this.imagesService.findOne({ id: data.imageId });

    const comment = await this.repository.create({ userId, ...data });

    return comment;
  }
}
