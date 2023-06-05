import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from 'eventemitter2';
import { PortfolioDeletedEvent, PortfoliosEvents } from './portfolios.events';

@Injectable()
export class PortfoliosEventsPublisher {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  delete(dto: PortfolioDeletedEvent): boolean {
    return this.eventEmitter.emit(PortfoliosEvents.PORTFOLIO_DELETED, dto);
  }
}
