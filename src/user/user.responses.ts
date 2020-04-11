import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserTokenResponse {
  @Field((type) => String)
  token: string;
}

@ObjectType()
export class UserCheckAuthResponse {
  @Field((type) => Boolean)
  result: boolean;
}
