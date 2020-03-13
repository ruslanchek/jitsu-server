import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectEntity } from './project.entity';
import { ProjectResolvers } from './project.resolvers';
import { DateScalar } from '../common/scalars/date.scalar';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/user.entity';
import { PubSubService } from '../common/services/pubsub.service';
import { InviteEntity } from '../invite/invite.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEntity, InviteEntity, UserEntity])],
  providers: [PubSubService, ProjectService, ProjectResolvers, DateScalar, UserService],
  exports: [ProjectService],
})
export class ProjectModule {}
