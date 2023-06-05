import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  UserDeletedEvent,
  UsersEvents,
} from 'src/modules/users/events/users.events';
import { PortfoliosService } from '../portfolios.service';

@Injectable()
export class PortfoliosEventsListener {
  constructor(private readonly portfoliosService: PortfoliosService) {}

  @OnEvent(UsersEvents.USER_DELETED)
  handleUserDeleted({ userId }: UserDeletedEvent): Promise<void> {
    return this.portfoliosService.deleteBulkByUserId(userId);
  }
}
