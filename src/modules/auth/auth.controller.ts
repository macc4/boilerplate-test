import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Transaction } from 'sequelize';
import { ErrorResponse } from '../../common/types';

import { ApiCommonResponses } from '../../common/decorators/api-common';
import { TransactionParam } from '../../common/decorators/transaction.decorator';
import { TransactionInterceptor } from '../../common/interceptors/sequelize-transaction.interceptor';

import { SignInDto, TokensResponse } from './auth.dto';
import { AuthService } from './auth.service';

@Controller(`auth`)
@ApiTags('Auth')
@ApiCommonResponses()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseInterceptors(TransactionInterceptor)
  @Post('/sign-up')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Sign up' })
  @ApiConflictResponse({
    description: 'User already exists',
    type: ErrorResponse,
  })
  @ApiCreatedResponse({
    description: 'Return tokens',
    type: TokensResponse,
  })
  signUp(
    @Body() dto: SignInDto,
    @TransactionParam() transaction: Transaction,
  ): Promise<TokensResponse> {
    return this.authService.signUp(dto, transaction);
  }

  @Post('/sign-in')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign in' })
  @ApiOkResponse({
    description: 'Return tokens',
    type: TokensResponse,
  })
  signIn(
    @Body()
    dto: SignInDto,
  ): Promise<TokensResponse> {
    return this.authService.signIn(dto);
  }
}
