import { Args, Resolver, Query, Mutation } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './user';
import { UserInputLogin, UserInputRegister } from './user.input';

@Resolver(of => User)
export class UserResolvers {
  constructor(private readonly userService: UserService) {}

  @Query(returns => User)
  async login(@Args('input') input: UserInputLogin): Promise<User> {
    return await this.userService.login(input.email, input.password);
  }

  @Mutation(returns => User)
  async register(@Args('input') input: UserInputRegister): Promise<User> {
    return await this.userService.register(input.email, input.password);
  }
}
