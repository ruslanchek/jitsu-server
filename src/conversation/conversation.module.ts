import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DateScalar } from '../common/scalars/date.scalar';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/user.entity';
import { ConversationEntity } from './conversation.entity';
import { ConversationService } from './conversation.service';
import { DocumentEntity } from '../document/document.entity';
import { DocumentService } from '../document/document.service';
import { ProjectService } from '../project/project.service';
import { ProjectEntity } from '../project/project.entity';
import { ConversationResolvers } from './conversation.resolvers';
import { PubSubService } from '../common/services/pubsub.service';
import { InviteEntity } from '../invite/invite.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConversationEntity, UserEntity, DocumentEntity, ProjectEntity, InviteEntity]),
  ],
  providers: [
    PubSubService,
    ConversationService,
    ConversationResolvers,
    UserService,
    DocumentService,
    ProjectService,
    DateScalar,
  ],
  exports: [ConversationService],
})
export class ConversationModule {}
