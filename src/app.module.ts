import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AuthStrategy } from './common/auth/auth.strategy';
import { ExceptionFilter } from './common/filters/exception.filter';
import { AuthModule } from './modules/auth/auth.module';
import { SharedModule } from './modules/shared/shared.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [SharedModule, AuthModule, UsersModule],
  providers: [
    AuthStrategy,
    {
      provide: APP_FILTER,
      useClass: ExceptionFilter,
    },
  ],
})
export class AppModule {}
