import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { ErrorResponse } from '../../common/types';
import { ApiCommonResponses } from '../../common/decorators/api-common';
import { JwtGuard, User, UserDto } from '../../common/auth';
import { UsersService } from './users.service';
import { UserModel } from './user.model';

@Controller(`users`)
@UseGuards(JwtGuard)
@ApiTags('Users')
@ApiCommonResponses()
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get my profile data.' })
  @ApiOkResponse({
    description: 'Returns user profile.',
    type: UserModel,
  })
  @ApiNotFoundResponse({
    description: 'Throws error if user not found.',
    type: ErrorResponse,
  })
  getProfile(@User() user: UserDto): Promise<UserModel> {
    return this.usersService.getMyProfile(user.id);
  }

  @Delete('me')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete user by id.' })
  @ApiNotFoundResponse({
    description: 'Throws error if user not found.',
    type: ErrorResponse,
  })
  @ApiNoContentResponse({
    description: 'Return void if successful',
    type: null,
  })
  deleteMyAccount(@User() user: UserDto): Promise<void> {
    return this.usersService.deleteById(user.id);
  }
}
