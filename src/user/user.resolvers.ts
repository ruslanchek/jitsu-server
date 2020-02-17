import { NotFoundException } from '@nestjs/common';
import { Args, Resolver, Query, Mutation } from '@nestjs/graphql';
import { Arg } from 'type-graphql';
import { UserService } from './user.service';
import { User } from './user';
import { GetUserByIdInput, UpdateUserNameInput } from './user.input';

@Resolver(of => User)
export class UserResolvers {
  constructor(private readonly userService: UserService) {}

  @Query(returns => User)
  async getUserById(
    @Arg('input', { validate: true })
    @Args('input')
    input: GetUserByIdInput,
  ): Promise<User> {
    try {
      return await this.userService.findOneById(input.id);
    } catch (e) {
      throw new NotFoundException(input.id);
    }
  }

  @Query(returns => [User])
  async getUsers(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Mutation(returns => User)
  async changeUserName(
    @Args('input')
    @Arg('input', { validate: true })
    input: UpdateUserNameInput,
  ): Promise<User> {
    return await this.userService.changeUserName(input.id, input.name);
  }
}
