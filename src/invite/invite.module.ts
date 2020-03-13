import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DateScalar } from '../common/scalars/date.scalar';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/user.entity';
import { ProjectService } from '../project/project.service';
import { ProjectEntity } from '../project/project.entity';
import { PubSubService } from '../common/services/pubsub.service';
import { TimelineService } from '../timeline/timeline.service';
import { TimelineEntity } from '../timeline/timeline.entity';
import { InviteService } from './invite.service';
import { InviteEntity } from './invite.entity';
import { InviteResolvers } from './invite.resolvers';

@Module({
  imports: [TypeOrmModule.forFeature([InviteEntity, UserEntity, ProjectEntity, TimelineEntity])],
  providers: [PubSubService, TimelineService, InviteService, UserService, ProjectService, InviteResolvers, DateScalar],
  exports: [InviteService],
})
export class InviteModule {}
