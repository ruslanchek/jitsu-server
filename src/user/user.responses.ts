import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class UserTokenResponse {
  @Field(type => String)
  token: string;
}