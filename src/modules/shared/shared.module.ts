import { Global, Logger, Module } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { validationSchema } from '../../config/validationSchema';

import { UserModel } from '../users/user.model';
import { PortfolioModel } from '../portfolios/portfolio.model';
import { ImageModel } from '../images/image.model';
import { CommentModel } from '../comments/comment.model';
import { EventEmitterModule } from '@nestjs/event-emitter';

const sequelizeModels = [UserModel, PortfolioModel, ImageModel, CommentModel];

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
    }),
    SequelizeModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get('DB_HOST'),
        port: Number(configService.get('DB_PORT')),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        models: sequelizeModels,
        logging: false,
        autoLoadModels: false,
        define: {
          timestamps: true,
          underscored: true,
          updatedAt: false,
          paranoid: true,
        },
      }),
      inject: [ConfigService],
    }),
    EventEmitterModule.forRoot(),
  ],
  providers: [Logger],
  exports: [Logger],
})
export class SharedModule {}
