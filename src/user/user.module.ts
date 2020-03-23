import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UserResolvers } from './user.resolvers';
import { EmailService } from '../email/email.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UserService, UserResolvers, EmailService],
  exports: [UserService],
})
export class UserModule {}
