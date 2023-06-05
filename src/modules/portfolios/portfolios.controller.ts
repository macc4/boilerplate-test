import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
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
import { PortfolioModel } from './portfolio.model';
import { CreatePortfolioDto, GetPortfoliosQuery } from './portfolios.dto';
import { PortfoliosService } from './portfolios.service';

@Controller(`portfolios`)
@UseGuards(JwtGuard)
@ApiTags('Portfolios')
@ApiCommonResponses()
@ApiBearerAuth()
export class PortfoliosController {
  constructor(private readonly portfoliosService: PortfoliosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new portfolio.' })
  @ApiCreatedResponse({
    description: 'Return the portfolio.',
    type: PortfolioModel,
  })
  createPortfolio(
    @User() user: UserDto,
    @Body() dto: CreatePortfolioDto,
  ): Promise<PortfolioModel> {
    return this.portfoliosService.createPortfolio(user.id, dto);
  }

  @Get('me')
  @ApiOperation({ summary: `Find all user's portfolios.` })
  @ApiOkPaginatedResponse(
    { model: PortfolioModel },
    {
      description: 'Returns a paginated response with portfolios.',
    },
  )
  findAllMyCampaigns(
    @User() user: UserDto,
    @Query() dto: GetPortfoliosQuery,
  ): Promise<PaginatedResponse<PortfolioModel>> {
    return this.portfoliosService.findAllMyPortfolios(user.id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete portfolio by id.' })
  @ApiNotFoundResponse({
    description: 'Throws error if portfolio not found.',
    type: ErrorResponse,
  })
  @ApiNoContentResponse({
    description: 'Return void if successful',
  })
  deleteMyAccount(
    @Param('id', new ParseIntPipe()) id: number,
    @User() user: UserDto,
  ): Promise<void> {
    return this.portfoliosService.deleteById(id, user.id);
  }
}
