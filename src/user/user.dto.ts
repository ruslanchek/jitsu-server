import { ArgsType, Field, ID } from 'type-graphql';
import { IsUUID } from 'class-validator';

@ArgsType()
export class GetUserByIdArgs {
  @IsUUID()
  @Field(() => ID)
  id: string;
}
