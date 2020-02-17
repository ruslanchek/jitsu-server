import { InputType, Field, ID } from 'type-graphql';
import { IsUUID } from 'class-validator';
import { User } from './user';

@InputType()
export class GetUserByIdInput implements Partial<User> {
  @Field(() => ID)
  @IsUUID()
  id: string;
}

@InputType()
export class UpdateUserNameInput implements Partial<User> {
  @Field(() => ID)
  @IsUUID()
  id: string;

  @Field(() => String)
  name: string;
}