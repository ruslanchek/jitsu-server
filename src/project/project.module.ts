import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectEntity } from './project.entity';
import { ProjectResolvers } from './project.resolvers';
import { DateScalar } from '../common/scalars/date.scalar';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/user.entity';
import { PubSubService } from '../common/services/pubsub.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEntity, UserEntity])],
  providers: [PubSubService, ProjectService, ProjectResolvers, DateScalar, UserService],
  exports: [ProjectService],
})
export class ProjectModule {}
