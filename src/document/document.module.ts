import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/user.entity';
import { DocumentEntity } from './document.entity';
import { DocumentService } from './document.service';
import { DocumentResolvers } from './document.resolvers';
import { ProjectService } from '../project/project.service';
import { ProjectEntity } from '../project/project.entity';
import { DocumentPriorityScalar, DocumentStatusScalar, DocumentTypeScalar } from './document.scalars';
import { PubSubService } from '../common/services/pubsub.service';
import { TimelineService } from '../timeline/timeline.service';
import { TimelineEntity } from '../timeline/timeline.entity';
import { InviteEntity } from '../invite/invite.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentEntity, UserEntity, ProjectEntity, InviteEntity, TimelineEntity])],
  providers: [
    PubSubService,
    TimelineService,
    DocumentService,
    UserService,
    ProjectService,
    DocumentResolvers,
    DocumentTypeScalar,
    DocumentPriorityScalar,
    DocumentStatusScalar,
  ],
  exports: [DocumentService],
})
export class DocumentModule {}
