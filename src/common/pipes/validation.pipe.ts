import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CustomValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return value;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const object = plainToInstance(metatype, value);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const errors = await validate(object, {
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    });

    if (errors.length > 0) {
      const messages = errors.map((error) => {
        const constraints = error.constraints;
        return Object.values(constraints || {}).join(', ');
      });

      throw new BadRequestException({
        message: 'Validation failed',
        details: messages,
      });
    }

    return object;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
