import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { EErrorMessage } from '../messages';
import { ENV } from '../env';
import { UserCheckAuthResponse, UserTokenResponse } from './user.responses';
import { uniqueNamesGenerator, adjectives, colors, countries } from 'unique-names-generator';
import { EmailService } from '../email/email.service';
import { EMAIL_DATA } from '../constants';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly emailService: EmailService,
  ) {}

  private generateNickname() {
    return uniqueNamesGenerator({
      dictionaries: [adjectives, colors, countries],
      length: 2,
      separator: '-',
    });
  }

  private generatePasswordHash(password: string): string {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  }

  private generateCodeHash(string: string): string {
    return encodeURIComponent(bcrypt.hashSync(`${string}${Date.now()}`, bcrypt.genSaltSync(10)));
  }

  private generateTokenResponse(id: string) {
    const tokenResponse = new UserTokenResponse();
    tokenResponse.token = jwt.sign(
      {
        id,
      },
      ENV.JWT_SECRET,
      { expiresIn: ENV.JWT_EXPIRES_SECONDS },
    );
    return tokenResponse;
  }

  async findByEmail(email: string, select?: Array<keyof UserEntity>): Promise<UserEntity | undefined> {
    const items = await this.userRepository.find({
      where: {
        email,
      },
      select,
    });
    return items.length > 0 ? items[0] : undefined;
  }

  async findById(id: string, select?: Array<keyof UserEntity>): Promise<UserEntity | undefined> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
      select,
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async checkAuth(userId: string): Promise<UserCheckAuthResponse> {
    try {
      const user = await this.userRepository.findOne(userId);
      if (user && user.id === userId) {
        return {
          result: true,
        };
      }
    } catch (e) {}
    return {
      result: false,
    };
  }

  async findByWhere(where: Partial<UserEntity>, fields?: Array<keyof UserEntity>): Promise<UserEntity | undefined> {
    const users = await this.userRepository.find({
      where,
      select: fields ? fields : undefined,
      take: 1,
    });
    if (users.length > 0) {
      return users[0];
    }
  }

  async update(id: string, userData: Partial<UserEntity>): Promise<UserEntity | undefined> {
    const foundUser = await this.findById(id);
    if (foundUser) {
      await this.userRepository.update(id, userData);
      return await this.userRepository.findOne(id);
    } else {
      throw new NotFoundException(EErrorMessage.InvalidUser);
    }
  }

  async login(email: string, password: string): Promise<UserTokenResponse> {
    const user = await this.findByEmail(email, ['id', 'passwordHash']);
    if (user && bcrypt.compareSync(password, user.passwordHash)) {
      return this.generateTokenResponse(user.id);
    } else {
      throw new BadRequestException(EErrorMessage.LoginIncorrect);
    }
  }

  async register(email: string, password: string): Promise<UserTokenResponse> {
    const foundUser = await this.findByEmail(email);
    if (foundUser) {
      throw new ConflictException(EErrorMessage.UserAlreadyExists);
    } else {
      const emailConfirmationCode = this.generateCodeHash(email);
      const result = await this.userRepository.insert({
        email,
        nickname: this.generateNickname(),
        passwordHash: this.generatePasswordHash(password),
        emailConfirmationCode,
      });
      if (result.identifiers.length > 0) {
        const user = await this.findById(result.identifiers[0].id);
        await this.emailService.sendWelcome(user.email, {
          username: user.nickname,
          name: user.nickname,
          actionUrl: EMAIL_DATA.APP_LINK,
        });
        return this.generateTokenResponse(result.identifiers[0].id);
      } else {
        throw new InternalServerErrorException(EErrorMessage.ServerError);
      }
    }
  }
}
