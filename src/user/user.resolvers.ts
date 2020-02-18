import { Args, Resolver, Query, Mutation } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { UserInputLogin, UserInputRegister } from './user.input';
import { UserTokenResponse } from './user.responses';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from '../common/decorators/currentUser.decorator';
import { IAuthCurrentUserPayload } from '../auth/jwt.strategy';

@Resolver(of => UserEntity)
export class UserResolvers {
  constructor(private readonly userService: UserService) {}

  @Query(returns => UserEntity)
  @UseGuards(GqlAuthGuard)
  async me(@CurrentUser() user: IAuthCurrentUserPayload): Promise<UserEntity> {
    return await this.userService.findById(user.id);
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
