import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { PROVIDER_NAMES } from '../constants';

@Injectable()
export class UserService {
  constructor(
    @Inject(PROVIDER_NAMES.USER_REPOSITORY)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<UserEntity[]> {
    // await this.userRepository.insert(new UserEntity());
    return await this.userRepository.find();
  }

  async findOneById(id: string): Promise<UserEntity> {
    return (await this.userRepository.findByIds([id]))[0];
  }
}
