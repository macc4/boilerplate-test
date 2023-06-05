import { BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export const formatValidationError = (
  errors: ValidationError[],
): BadRequestException => {
  const result: {
    property: string;
    constraints: ValidationError['constraints'];
    value: ValidationError['value'];
  }[] = [];

  const helper = (
    { property, constraints, children, value }: ValidationError,
    prefix: string,
  ): void => {
    const keyPath = prefix ? `${prefix}.${property}` : property;

    if (constraints) {
      result.push({
        property: keyPath,
        constraints,
        value,
      });
    }

    if (children && children.length) {
      children.forEach((child) => helper(child, keyPath));
    }
  };

  errors.forEach((error) => helper(error, ``));

  return new BadRequestException(result);
};
