import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { ImageModel } from './image.model';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { ImagesRepository } from './images.repository';
import { PortfoliosModule } from '../portfolios/portfolios.module';
import { AWSModule } from '../shared/aws/aws.module';
import { ImagesEventsListener } from './events/images-events.listener';

@Module({
  imports: [
    SequelizeModule.forFeature([ImageModel]),
    PortfoliosModule,
    AWSModule,
  ],
  controllers: [ImagesController],
  providers: [ImagesService, ImagesRepository, ImagesEventsListener],
  exports: [ImagesService],
})
export class ImagesModule {}
