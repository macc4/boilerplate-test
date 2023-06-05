import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { UserModel } from './user.model';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  imports: [SequelizeModule.forFeature([UserModel])],
  controllers: [],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
