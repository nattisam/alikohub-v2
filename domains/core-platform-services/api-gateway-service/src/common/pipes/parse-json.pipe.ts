import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseJsonPipe implements PipeTransform {
  transform(value: string) {
    if (typeof value !== 'string') {
      throw new BadRequestException('The field must be a JSON string.');
    }
    try {
      return JSON.parse(value);
    } catch (error) {
      throw new BadRequestException('Invalid JSON string.');
    }
  }
}