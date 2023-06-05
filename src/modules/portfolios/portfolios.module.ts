import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { PortfolioModel } from './portfolio.model';
import { PortfoliosController } from './portfolios.controller';
import { PortfoliosRepository } from './portfolios.repository';
import { PortfoliosService } from './portfolios.service';
import { PortfoliosEventsListener } from './events/portfolios-events.listener';
import { PortfoliosEventsPublisher } from './events/portfolios-events.publisher';

@Module({
  imports: [SequelizeModule.forFeature([PortfolioModel])],
  controllers: [PortfoliosController],
  providers: [
    PortfoliosService,
    PortfoliosRepository,
    PortfoliosEventsListener,
    PortfoliosEventsPublisher,
  ],
  exports: [PortfoliosService],
})
export class PortfoliosModule {}
