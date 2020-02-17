import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    // this.userRepository.insert({name: Math.random().toString()})
    return await this.userRepository.find();
  }

  async findOneById(id: string): Promise<User> {
    return (await this.userRepository.findByIds([id]))[0];
  }

  async changeUserName(id: string, name: string): Promise<User> {
    await this.userRepository.update(id, { name });
    return await this.findOneById(id);
  }
}
