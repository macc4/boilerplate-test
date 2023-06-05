import { Logger, ValidationPipe } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { ALLOWED_CORS_ORIGINS } from './common/constants/constants';
import { formatValidationError } from './common/helpers';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService>(ConfigService);
  const logger = app.get(Logger);

  app.enableCors((req, callback) => {
    let corsOptions: CorsOptions;

    if (
      ALLOWED_CORS_ORIGINS[configService.get('NODE_ENV')].includes(
        req.header('Origin'),
      )
    ) {
      corsOptions = { origin: true };
    } else {
      corsOptions = { origin: false };
    }
    callback(null, corsOptions);
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      transformOptions: { enableImplicitConversion: false },
      exceptionFactory: formatValidationError,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('AppMail Platform backend documentation')
    .setDescription('AppMail Platform API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig, {
    deepScanRoutes: true,
  });

  const apiRoute = 'api-docs';

  SwaggerModule.setup(apiRoute, app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  const port = configService.get('PORT');

  await app.listen(port);

  logger.debug(
    `Documentation at http://localhost:${port}/${apiRoute}`,
    'NestApplication',
  );
}
bootstrap();
