import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UserResolvers } from './user.resolvers';
import { DateScalar } from '../common/scalars/date.scalar';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UserService, UserResolvers, DateScalar],
  exports: [UserService],
})
export class UserModule {}
