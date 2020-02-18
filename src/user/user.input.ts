import { InputType, Field } from 'type-graphql';
import { IsEmail, MinLength, MaxLength } from 'class-validator';
import { UserEntity } from './user.entity';
import { EErrorMessage } from '../messages';

@InputType()
export class UserInputLogin implements Partial<UserEntity> {
  @Field(() => String)
  @IsEmail({}, { message: EErrorMessage.IsEmail })
  email: string;

  @Field(() => String)
  @MinLength(6, { message: EErrorMessage.PasswordMinLength })
  @MaxLength(64, { message: EErrorMessage.PasswordMaxLength })
  password: string;
}

@InputType()
export class UserInputRegister implements Partial<UserEntity> {
  @Field(() => String)
  @IsEmail({}, { message: EErrorMessage.IsEmail })
  email: string;

  @Field(() => String)
  @MinLength(6, { message: EErrorMessage.PasswordMinLength })
  @MaxLength(64, { message: EErrorMessage.PasswordMaxLength })
  password: string;
}
