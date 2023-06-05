import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AuthStrategy } from './common/auth/auth.strategy';
import { ExceptionFilter } from './common/filters/exception.filter';
import { AuthModule } from './modules/auth/auth.module';
import { SharedModule } from './modules/shared/shared.module';
import { UsersModule } from './modules/users/users.module';
import { PortfoliosModule } from './modules/portfolios/portfolios.module';
import { ImagesModule } from './modules/images/images.module';
import { CommentsModule } from './modules/comments/comments.module';

@Module({
  imports: [
    SharedModule,
    AuthModule,
    UsersModule,
    PortfoliosModule,
    ImagesModule,
    CommentsModule,
  ],
  providers: [
    AuthStrategy,
    {
      provide: APP_FILTER,
      useClass: ExceptionFilter,
    },
  ],
})
export class AppModule {}
