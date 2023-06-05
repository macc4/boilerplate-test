/* eslint-disable @typescript-eslint/ban-types */
import { applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiResponseOptions,
  getSchemaPath,
} from '@nestjs/swagger';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { PaginatedResponse } from '../types';

export function ApiOkPaginatedResponse(
  data: { model: Function; metadata?: Function },
  options?: Omit<ApiResponseOptions, 'schema'>,
): MethodDecorator {
  const { model, metadata } = data;

  const extraModelsArray = [model];
  const schemaPropertiesObject: SchemaObject = {
    properties: {
      data: {
        type: 'array',
        items: { $ref: getSchemaPath(model) },
      },
    },
  };

  if (metadata) {
    extraModelsArray.push(metadata);
    schemaPropertiesObject.properties.metadata = {
      $ref: getSchemaPath(metadata),
    };
  }

  return applyDecorators(
    ApiExtraModels(PaginatedResponse, ...extraModelsArray),
    ApiOkResponse({
      ...options,
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedResponse) },
          {
            ...schemaPropertiesObject,
          },
        ],
      },
    }),
  );
}
