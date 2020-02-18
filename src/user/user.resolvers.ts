import { Args, Resolver, Query, Mutation } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { UserInputLogin, UserInputRegister } from './user.input';
import { UserTokenResponse } from './user.responses';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/auth.guard';

@Resolver(of => UserEntity)
export class UserResolvers {
  constructor(private readonly userService: UserService) {}

  @Query(returns => UserTokenResponse)
  @UseGuards(GqlAuthGuard)
  async me(): Promise<UserTokenResponse> {
    return {token: '1'};
  }

  @Query(returns => UserTokenResponse)
  async login(@Args('input') input: UserInputLogin): Promise<UserTokenResponse> {
    return await this.userService.login(input.email, input.password);
  }

  @Mutation(returns => UserTokenResponse)
  async register(@Args('input') input: UserInputRegister): Promise<UserTokenResponse> {
    return await this.userService.register(input.email, input.password);
  }
}
