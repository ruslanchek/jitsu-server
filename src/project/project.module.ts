import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectEntity, ProjectEntityAdmin } from './project.entity';
import { ProjectResolvers } from './project.resolvers';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/user.entity';
import { PubSubService } from '../common/services/pubsub.service';
import { InviteEntity } from '../invite/invite.entity';
import { UploadService } from '../upload/upload.service';
import { ProjectController } from './project.controller';
import { AvatarService } from '../avatar/avatar.service';
import { EmailService } from '../email/email.service';
import { DefaultAdminModule, DefaultAdminSite } from 'nestjs-admin';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEntity, InviteEntity, UserEntity]), DefaultAdminModule],
  providers: [PubSubService, ProjectService, ProjectResolvers, UserService, UploadService, AvatarService, EmailService],
  exports: [ProjectService],
  controllers: [ProjectController],
})
export class ProjectModule {
  constructor(private readonly adminSite: DefaultAdminSite) {
    adminSite.register('Project', ProjectEntityAdmin);
  }
}
