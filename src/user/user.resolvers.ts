import { NotFoundException, UseGuards } from '@nestjs/common';
import { Args, Resolver, Query, Mutation } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './user';
import { GetUserByIdInput, UpdateUserEmailInput } from './user.input';

@Resolver(of => User)
export class UserResolvers {
  constructor(private readonly userService: UserService) {}

  @Query(returns => User)
  async getUserById(@Args('input') input: GetUserByIdInput): Promise<User> {
    try {
      return await this.userService.findById(input.id);
    } catch (e) {
      throw new NotFoundException(input.id);
    }
  }

  @Mutation(returns => User)
  async changeUserEmail(@Args('input') input: UpdateUserEmailInput): Promise<User> {
    return await this.userService.update(input.id, { email: input.email });
  }
}
