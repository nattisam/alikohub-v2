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
      const errors = error.details.map(d => ({
        field: d.path.join('.'),
        message: d.message,
        type: d.type
      }));
      throw new BadRequestException({
        message: 'Validation failed',
        errors
      });
    }
    
    return validatedValue;
  }
}
