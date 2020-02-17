import { NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { PubSub } from 'apollo-server-express';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { GetUserByIdArgs, GetUsersArgs } from './user.dto';
import { validateDto } from '../utils/api.utils';

const pubSub = new PubSub();

@Resolver(of => UserEntity)
export class UserResolvers {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserEntity)
  async getUserById(@Args() args: GetUserByIdArgs): Promise<UserEntity> {
    if(await validateDto(GetUserByIdArgs, args)) {
      try {
        return await this.userService.findOneById(args.id);
      } catch (e) {
        throw new NotFoundException(args.id);
      }
    }
  }

  @Query(() => [UserEntity])
  async getUsers(@Args() args: GetUsersArgs): Promise<UserEntity[]> {
    if(await validateDto(GetUserByIdArgs, args)) {
      try {
        return await this.userService.findAll();
      } catch (e) {
        throw new InternalServerErrorException();
      }
    }
  }
}