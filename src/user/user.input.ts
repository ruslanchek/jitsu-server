import { InputType, Field, ID } from 'type-graphql';
import { IsUUID, IsEmail } from 'class-validator';
import { User } from './user';
import { EMessageType } from '../messages';

@InputType()
export class GetUserByIdInput implements Partial<User> {
  @Field(() => ID)
  @IsUUID()
  id: string;
}

@InputType()
export class UpdateUserEmailInput implements Partial<User> {
  @Field(() => ID)
  @IsUUID()
  id: string;

  @Field(() => String)
  @IsEmail({}, { message: EMessageType.IsEmail })
  email: string;
}
