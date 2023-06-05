import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDto } from './user.dto';

export const User = createParamDecorator(
  (_data, context: ExecutionContext): UserDto => {
    const req = context.switchToHttp().getRequest();

    return req.user;
  },
);
