import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectEntity } from './project.entity';
import { UserService } from '../user/user.service';
import { ProjectChangeInput, ProjectCreateInput } from './project.inputs';
import { EErrorMessage } from '../messages';
import { EPubSubTriggers, PubSubService } from '../common/services/pubsub.service';
import { InviteEntity } from '../invite/invite.entity';
import { EUploadDirectory, IFile, UploadService } from '../upload/upload.service';

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
  ) {}

  async getProject(userId: string, projectId: string): Promise<ProjectEntity> {
    const user = await this.userService.findById(userId);
    const project = await this.projectRepository.findOne({
      where: {
        id: projectId,
        user,
      },
    });

    if (project) {
      return project;
    }

    throw new NotFoundException(EErrorMessage.ProjectNotFound);
  }

  async findProjects(userId: string): Promise<ProjectEntity[]> {
    const user = await this.userService.findById(userId);
    return this.projectRepository.find({
      join: { alias: 'projects', innerJoin: { user: 'projects.user' } },
      where: {
        user,
      },
    });
  }

  async create(userId: string, input: ProjectCreateInput): Promise<ProjectEntity> {
    const user = await this.userService.findById(userId);
    const result = await this.projectRepository.insert({
      ...input,
      user,
    });
    const createdProject = await this.getProject(userId, result.identifiers[0].id);
    await this.pubSubService.pubSub.publish(EPubSubTriggers.ProjectCreated, { projectCreated: createdProject });
    return createdProject;
  }

  async change(userId: string, projectId: string, input: ProjectChangeInput): Promise<ProjectEntity> {
    const user = await this.userService.findById(userId);
    const project = await this.getProject(user.id, projectId);
    if (!project) {
      throw new NotFoundException(EErrorMessage.ProjectNotFound);
    }
    await this.projectRepository.update({ id: projectId, user }, input);
    const changedProject = await this.getProject(user.id, projectId);
    await this.pubSubService.pubSub.publish(EPubSubTriggers.ProjectChanged, { projectChanged: changedProject });
    return changedProject;
  }

  async uploadAvatar(userId: string, projectId: string, file: IFile): Promise<string> {
    const user = await this.userService.findById(userId);
    const project = await this.getProject(user.id, projectId);
    if (!project) {
      throw new NotFoundException(EErrorMessage.ProjectNotFound);
    }

    const result = await this.uploadService.uploadFile(file, EUploadDirectory.ProjectAvatar, project.id);

    if (result.Location) {
      await this.projectRepository.update(
        { id: projectId, user },
        {
          avatar: result.Location,
        },
      );

      return result.Location;
    } else {
      throw new InternalServerErrorException();
    }
  }
}
