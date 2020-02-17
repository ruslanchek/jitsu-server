import { BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';

export async function validateDto(validationClass, args): Promise<boolean> {
  const validationClassInstance = new validationClass();

  for (const key in args) {
    if(args.hasOwnProperty(key)) {
      validationClassInstance[key] = args[key];
    }
  }

  const validation = await validate(args);

  if(validation.length === 0) {
    return true;
  }

  throw new BadRequestException(validation);
}