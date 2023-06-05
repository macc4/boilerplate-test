import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { JwtGuard, User, UserDto } from '../../common/auth';
import { ApiCommonResponses } from '../../common/decorators/api-common';
import { CommentModel } from './comment.model';
import { CreateCommentDto } from './comments.dto';
import { CommentsService } from './comments.service';

@Controller(`comments`)
@UseGuards(JwtGuard)
@ApiTags('Comments')
@ApiCommonResponses()
@ApiBearerAuth()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiCreatedResponse({
    description: 'Return the comment',
    type: CommentModel,
  })
  createComment(
    @User() user: UserDto,
    @Body() dto: CreateCommentDto,
  ): Promise<CommentModel> {
    return this.commentsService.createComment(user.id, dto);
  }
}
