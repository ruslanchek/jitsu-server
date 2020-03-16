import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimelineEntity } from './timeline.entity';
import { TimelineService } from './timeline.service';
import { TimelineResolvers } from './timeline.resolvers';
import { UserService } from '../user/user.service';
import { DocumentEntity } from '../document/document.entity';
import { UserEntity } from '../user/user.entity';
import { DocumentService } from '../document/document.service';
import { ProjectEntity } from '../project/project.entity';
import { ProjectService } from '../project/project.service';
import { PubSubService } from '../common/services/pubsub.service';
import { InviteEntity } from '../invite/invite.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TimelineEntity, UserEntity, DocumentEntity, ProjectEntity, InviteEntity])],
  providers: [
    PubSubService,
    DocumentService,
    TimelineService,
    UserService,
    ProjectService,
    TimelineResolvers,
  ],
  exports: [TimelineService],
})
export class TimelineModule {}
