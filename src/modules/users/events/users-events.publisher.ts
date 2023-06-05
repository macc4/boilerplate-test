import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from 'eventemitter2';
import { UserDeletedEvent, UsersEvents } from './users.events';

@Injectable()
export class UsersEventsPublisher {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  delete(dto: UserDeletedEvent): boolean {
    return this.eventEmitter.emit(UsersEvents.USER_DELETED, dto);
  }
}
