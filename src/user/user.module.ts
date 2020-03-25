import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntityAdmin, UserEntity } from './user.entity';
import { UserResolvers } from './user.resolvers';
import { EmailService } from '../email/email.service';
import { DefaultAdminModule, DefaultAdminSite } from 'nestjs-admin';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), DefaultAdminModule],
  providers: [UserService, UserResolvers, EmailService],
  exports: [UserService],
})
export class UserModule {
  constructor(private readonly adminSite: DefaultAdminSite) {
    adminSite.register('User', UserEntityAdmin);
  }
}
