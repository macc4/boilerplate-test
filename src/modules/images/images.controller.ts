import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { ErrorResponse, PaginatedResponse } from '../../common/types';
import { ApiCommonResponses } from '../../common/decorators/api-common';
import { JwtGuard, User, UserDto } from '../../common/auth';
import { ApiOkPaginatedResponse } from '../../common/decorators/api-ok-paginated-response';
import { ImagesService } from './images.service';
import { ImageModel } from './image.model';
import {
  UploadImageDto,
  GetImageFeedQuery,
  ImageFeedObject,
  uploadImageSchema,
  DeleteImageDto,
} from './images.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  MAX_FILE_SIZE,
  SUPPORTED_IMAGE_FILE_TYPES_REGEX,
} from '../../common/constants/constants';
import { IsFileValidator } from '../../common/validators/isFile.validator';

@Controller(`images`)
@ApiTags('Images')
@ApiCommonResponses()
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody(uploadImageSchema)
  @ApiOperation({ summary: 'Upload a new image.' })
  @ApiCreatedResponse({
    description: 'Return the image.',
    type: ImageModel,
  })
  @ApiBearerAuth()
  createImage(
    @User() user: UserDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new IsFileValidator(),
          new FileTypeValidator({ fileType: SUPPORTED_IMAGE_FILE_TYPES_REGEX }),
          new MaxFileSizeValidator({ maxSize: MAX_FILE_SIZE }),
        ],
      }),
    )
    image: Express.Multer.File,
    @Body() dto: UploadImageDto,
  ): Promise<ImageModel> {
    return this.imagesService.uploadImage(user.id, image, dto);
  }

  @Get('feed')
  @ApiOperation({ summary: `Get image feed.` })
  @ApiOkPaginatedResponse(
    { model: ImageFeedObject },
    {
      description: 'Returns a paginated image feed.',
    },
  )
  getImageFeed(
    @Query() dto: GetImageFeedQuery,
  ): Promise<PaginatedResponse<ImageFeedObject>> {
    return this.imagesService.getImageFeed(dto);
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: `Get image by id with comments.` })
  @ApiOkPaginatedResponse(
    { model: ImageModel },
    {
      description: 'Returns the image with comments.',
    },
  )
  @ApiBearerAuth()
  getImageById(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<ImageModel> {
    return this.imagesService.findOne({ id });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Delete image by id.' })
  @ApiNotFoundResponse({
    description: 'Throws error if image not found.',
    type: ErrorResponse,
  })
  @ApiNoContentResponse({
    description: 'Return void if successful',
  })
  @ApiBearerAuth()
  deleteById(
    @Param('id', new ParseIntPipe()) id: number,
    @User() user: UserDto,
    @Body() dto: DeleteImageDto,
  ): Promise<void> {
    return this.imagesService.deleteById(id, dto.portfolioId, user.id);
  }
}
