import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

// 从验证结果中取出错误提示信息
const extractValidationErrorMessage = (errors) => {
  if (errors[0].constraints && errors[0].children.length === 0) {
    return Object.values(errors[0].constraints)[0];
  } else if (errors[0].children.length > 0 && !errors[0].constraints) {
    return extractValidationErrorMessage(errors[0].children);
  }
};

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value);
    const errors = await validate(object, {
      forbidUnknownValues: true,
      validationError: { target: false }
    });
    if (errors.length > 0) {
      throw new BadRequestException(extractValidationErrorMessage(errors));
    }
    return value;
  }

  private toValidate(metatype: InstanceType<any>): boolean {
    const types: InstanceType<any>[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
