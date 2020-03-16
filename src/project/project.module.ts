import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectEntity } from './project.entity';
import { ProjectResolvers } from './project.resolvers';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/user.entity';
import { PubSubService } from '../common/services/pubsub.service';
import { InviteEntity } from '../invite/invite.entity';
import { UploadService } from '../upload/upload.service';
import { ProjectController } from './project.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEntity, InviteEntity, UserEntity])],
  providers: [PubSubService, ProjectService, ProjectResolvers, UserService, UploadService],
  exports: [ProjectService],
  controllers: [ProjectController],
})
export class ProjectModule {}
