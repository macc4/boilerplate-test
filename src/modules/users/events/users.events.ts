export enum UsersEvents {
  USER_DELETED = 'USER_DELETED',
}

export class UserDeletedEvent {
  userId: number;
}
