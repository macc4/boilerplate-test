import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

import { ErrorResponse } from '../types';

export function ApiCommonResponses(): ClassDecorator & MethodDecorator {
  return applyDecorators(
    ApiBadRequestResponse({
      description: 'Invalid request message',
      type: ErrorResponse,
    }),

    ApiInternalServerErrorResponse({
      description: 'Common internal service error',
      type: ErrorResponse,
    }),
  );
}
