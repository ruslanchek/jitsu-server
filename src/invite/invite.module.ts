import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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
import { DocumentService } from '../document/document.service';
import { DocumentEntity } from '../document/document.entity';
import { UploadService } from '../upload/upload.service';

@Module({
  imports: [TypeOrmModule.forFeature([InviteEntity, UserEntity, ProjectEntity, TimelineEntity, DocumentEntity])],
  providers: [
    PubSubService,
    TimelineService,
    InviteService,
    DocumentService,
    UserService,
    ProjectService,
    InviteResolvers,
    UploadService,
  ],
  exports: [InviteService],
})
export class InviteModule {}
