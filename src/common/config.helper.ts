export class ConfigHelper {
  static toBool(value: unknown): boolean {
    if (typeof value === 'string') {
      return value === '1' || value.toLowerCase() === 'true';
    }

    if (typeof value === 'number') {
      return value === 1;
    }

    return false;
  }
}
