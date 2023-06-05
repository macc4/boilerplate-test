import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  PortfolioDeletedEvent,
  PortfoliosEvents,
} from 'src/modules/portfolios/events/portfolios.events';
import { ImagesService } from '../images.service';

@Injectable()
export class ImagesEventsListener {
  constructor(private readonly imagesService: ImagesService) {}

  @OnEvent(PortfoliosEvents.PORTFOLIO_DELETED)
  handlePortfolioDeleted({
    portfolioId,
  }: PortfolioDeletedEvent): Promise<void> {
    return this.imagesService.deleteBulkByPortfolioId(portfolioId);
  }
}
