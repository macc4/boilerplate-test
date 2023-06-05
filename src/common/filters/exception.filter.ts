import {
  ExceptionFilter as NestExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Error as SequelizeError } from 'sequelize';

import { ErrorResponse } from '../types';

@Catch()
export class ExceptionFilter implements NestExceptionFilter {
  constructor(
    private readonly logger: Logger,
    private readonly configService: ConfigService,
  ) {}

  catch(exception: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const instanceOfHttp = exception instanceof HttpException;

    const status = instanceOfHttp
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    let message: string;

    if (
      exception instanceof SequelizeError &&
      exception['original'] !== undefined
    ) {
      message = `Sequelize error: ${exception['original'].message}`;
    } else if (exception instanceof BadRequestException) {
      message = exception['response'].message;
    } else {
      message = exception.message;
    }

    const res: ErrorResponse = {
      message,
      status,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    if (!instanceOfHttp) {
      this.logger.error(
        {
          message: `${exception.name}: ${JSON.stringify(res.message)}`,
          context: ExceptionFilter.name,
        },
        exception.stack,
      );
    }

    if (
      this.configService.get<string>('NODE_ENV') === 'dev' &&
      !instanceOfHttp
    ) {
      res['stack'] = exception.stack;
    }

    response.status(status).json(res);
  }
}
