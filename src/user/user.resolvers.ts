import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { PubSub } from 'apollo-server-express';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { GetUserByIdArgs } from './user.dto';
import { validate } from 'class-validator';

const pubSub = new PubSub();

async function validateDto(validationClass: any, args: Object): Promise<boolean> {
  const validationClassInstance = new validationClass();

  for (const key in args) {
    if(args.hasOwnProperty(key)) {
      validationClassInstance[key] = args[key];
    }
  }

  const validation = await validate(args);

  if(validation.length === 0) {
    return true;
  }

  throw new BadRequestException(validation);
}

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
}