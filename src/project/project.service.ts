import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectEntity } from './project.entity';
import { UserService } from '../user/user.service';
import { ProjectChangeInput, ProjectCreateInput } from './project.inputs';
import { EErrorMessage } from '../messages';
import { EPubSubTriggers, PubSubService } from '../common/services/pubsub.service';
import { InviteEntity } from '../invite/invite.entity';
import { EUploadDirectory, IFile, IUploadResult, UploadService } from '../upload/upload.service';
import { AvatarService } from '../avatar/avatar.service';
import { AVATAR_SIZE } from '../constants';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
    @InjectRepository(InviteEntity)
    private readonly projectInviteRepository: Repository<InviteEntity>,
    private readonly userService: UserService,
    private readonly pubSubService: PubSubService,
    private readonly uploadService: UploadService,
    private readonly avatarService: AvatarService,
  ) {}

  async getProject(userId: string, projectId: string): Promise<ProjectEntity> {
    const user = await this.userService.findById(userId);
    let project = await this.projectRepository.findOne({
      where: {
        id: projectId,
        user,
      },
    });

    if (!project) {
      const invite = await this.projectInviteRepository.findOne({
        where: {
          invitedUser: user,
          active: true,
          project: {
            id: projectId,
          },
        },
      });

      if (invite) {
        project = invite.project;
      }
    }

    if (project) {
      return project;
    }

    throw new NotFoundException(EErrorMessage.ProjectNotFound);
  }

  async findProjects(userId: string): Promise<ProjectEntity[]> {
    const user = await this.userService.findById(userId);
    const ownProjects = await this.projectRepository.find({
      where: {
        user,
      },
    });
    const invites = await this.projectInviteRepository.find({
      where: {
        invitedUser: user,
        active: true,
      },
    });
    return ownProjects.concat(invites.map((invite) => invite.project));
  }

  async create(userId: string, input: ProjectCreateInput): Promise<ProjectEntity> {
    const user = await this.userService.findById(userId);
    const result = await this.projectRepository.insert({
      ...input,
      user,
    });

    const avatar = this.avatarService.generateAvatar(result.identifiers[0].id);
    const uploadResult = await this.uploadService.uploadImage(avatar, {
      uploadDir: EUploadDirectory.ProjectAvatar,
      customFileName: result.identifiers[0].id,
      size: {
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
      },
    });
    await this.projectRepository.update(result.identifiers[0].id, {
      avatar: uploadResult,
    });
    const projectCreated = await this.getProject(userId, result.identifiers[0].id);
    await this.pubSubService.pubSub.publish(EPubSubTriggers.ProjectCreated, { projectCreated });
    return projectCreated;
  }

  async change(userId: string, projectId: string, input: ProjectChangeInput): Promise<ProjectEntity> {
    const user = await this.userService.findById(userId);
    const project = await this.getProject(user.id, projectId);
    if (!project) {
      throw new NotFoundException(EErrorMessage.ProjectNotFound);
    }
    await this.projectRepository.update({ id: projectId, user }, input);
    const projectChanged = await this.getProject(user.id, projectId);
    await this.pubSubService.pubSub.publish(EPubSubTriggers.ProjectChanged, { projectChanged });
    return projectChanged;
  }

  async uploadAvatar(userId: string, projectId: string, file: IFile): Promise<IUploadResult[]> {
    const user = await this.userService.findById(userId);
    const project = await this.getProject(user.id, projectId);
    if (!project) {
      throw new NotFoundException(EErrorMessage.ProjectNotFound);
    }

    const uploadResult = await this.uploadService.uploadImage(file.buffer, {
      uploadDir: EUploadDirectory.ProjectAvatar,
      customFileName: project.id,
      size: {
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
      },
    });

    if (uploadResult) {
      await this.projectRepository.update(
        { id: projectId, user },
        {
          avatar: uploadResult,
        },
      );

      return uploadResult;
    } else {
      throw new InternalServerErrorException();
    }
  }
}
