import { InputType, Field, ID } from 'type-graphql';
import { IsUUID, IsEmail, MinLength, MaxLength } from 'class-validator';
import { User } from './user';
import { EErrorMessage } from '../messages';

@InputType()
export class UserInputLogin implements Partial<User> {
  @Field(() => String)
  @IsEmail({}, { message: EErrorMessage.IsEmail })
  email: string;

  @Field(() => String)
  @MinLength(6, { message: EErrorMessage.PasswordMinLength })
  @MaxLength(64, { message: EErrorMessage.PasswordMaxLength })
  password: string;
}

@InputType()
export class UserInputRegister implements Partial<User> {
  @Field(() => String)
  @IsEmail({}, { message: EErrorMessage.IsEmail })
  email: string;

  @Field(() => String)
  @MinLength(6, { message: EErrorMessage.PasswordMinLength })
  @MaxLength(64, { message: EErrorMessage.PasswordMaxLength })
  password: string;
}
