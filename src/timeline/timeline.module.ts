import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DateScalar } from '../common/scalars/date.scalar';
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
import { ProjectInviteEntity } from '../project/projectInvite.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TimelineEntity, UserEntity, DocumentEntity, ProjectEntity, ProjectInviteEntity])],
  providers: [
    PubSubService,
    DocumentService,
    TimelineService,
    UserService,
    ProjectService,
    TimelineResolvers,
    DateScalar,
  ],
  exports: [TimelineService],
})
export class TimelineModule {}
