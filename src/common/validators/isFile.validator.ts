import { FileValidator } from '@nestjs/common';

export class IsFileValidator extends FileValidator {
  constructor() {
    super({});
  }

  buildErrorMessage(): string {
    return `Validation failed (expected file)`;
  }

  isValid(file: Express.Multer.File): boolean {
    if (!file?.buffer) {
      return false;
    }

    return true;
  }
}
