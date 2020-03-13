import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectEntity } from './project.entity';
import { UserService } from '../user/user.service';
import { ProjectCreateInput } from './project.inputs';
import { EErrorMessage } from '../messages';
import { EPubSubTriggers, PubSubService } from '../common/services/pubsub.service';
import { ProjectInviteEntity } from './projectInvite.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
    @InjectRepository(ProjectInviteEntity)
    private readonly projectInviteRepository: Repository<ProjectInviteEntity>,
    private readonly userService: UserService,
    private readonly pubSubService: PubSubService,
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
}
