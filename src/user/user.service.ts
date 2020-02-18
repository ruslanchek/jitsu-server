import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user';
import bcrypt from 'bcrypt';
import { EErrorMessage } from '../messages';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private generatePasswordHash(password: string): string {
    return bcrypt.hashSync(
      password,
      bcrypt.genSaltSync(10),
    );
  }

  private generateCodeHash(string: string): string {
    return bcrypt.hashSync(
      `${string}${Date.now()}`,
      bcrypt.genSaltSync(10),
    );
  }

  async getUserWithPrivateFields(id: string): Promise<User | undefined> {
    return await this.findById(id, ['id', 'email']);
  }

  async getUserWithPublicFields(id: string): Promise<User | undefined> {
    return await this.findById(id, ['id']);
  }

  async findByEmail(email: string, fields?: Array<keyof User>): Promise<User | undefined> {
    const users = await this.userRepository.find({
      where: {
        email,
      },
      select: fields ? fields : undefined,
    });

    return users.length > 0 ? users[0] : undefined;
  }

  async findById(id: string, fields?: Array<keyof User>): Promise<User | undefined> {
    const users = await this.userRepository.find({
      where: {
        id,
      },
      select: fields ? fields : undefined,
    });

    return users.length > 0 ? users[0] : undefined;
  }

  async findByWhere(where: Partial<User>, fields?: Array<keyof User>): Promise<User | undefined> {
    const users = await this.userRepository.find({
      where,
      select: fields ? fields : undefined,
      take: 1,
    });

    if (users.length > 0) {
      return users[0];
    }
  }

  async update(id: string, userData: Partial<User>): Promise<User | undefined> {
    const foundUser = await this.findById(id);
    if (foundUser) {
      await this.userRepository.update(id, userData);
      return await this.userRepository.findOne(id);
    } else {
      throw new NotFoundException(EErrorMessage.InvalidUser);
    }
  }

  async login(email: string, password: string): Promise<User> {
    const foundUserCompare = await this.findByEmail(email, ['id', 'passwordHash']);
    if(foundUserCompare && bcrypt.compareSync(password, foundUserCompare.passwordHash)) {
      return await this.getUserWithPrivateFields(foundUserCompare.id);
    } else {
      throw new BadRequestException(EErrorMessage.LoginIncorrect);
    }
  }

  async register(email: string, password: string): Promise<User> {
    const foundUser = await this.findByEmail(email);
    if (foundUser) {
      throw new ConflictException(EErrorMessage.UserAlreadyExists);
    } else {
      const emailConfirmationCode = this.generateCodeHash(email);
      const result = await this.userRepository.insert({
        email,
        passwordHash: this.generatePasswordHash(password),
        emailConfirmationCode,
      });

      if (result.identifiers.length > 0) {
        const { id } = result.identifiers[0];
        return await this.userRepository.findOne(id);
      } else {
        throw new InternalServerErrorException(EErrorMessage.ServerError);
      }
    }
  }
}
