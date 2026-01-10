import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import * as Joi from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: Joi.ObjectSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body') {
      return value;
    }
    
    // Validate
    const { error, value: validatedValue } = this.schema.validate(value, {
      abortEarly: false,
      stripUnknown: true, 
    });
    
    if (error) {
      const messages = error.details.map(d => d.message).join(', ');
      throw new BadRequestException(`Validation failed: ${messages}`);
    }
    
    return validatedValue;
  }
}
