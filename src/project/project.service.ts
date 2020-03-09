import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectEntity } from './project.entity';
import { UserService } from '../user/user.service';
import { ProjectCreateInput } from './project.inputs';
import { EErrorMessage } from '../messages';
import { EPubSubTriggers, PubSubService } from '../common/services/pubsub.service';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
    private readonly userService: UserService,
    private readonly pubSubService: PubSubService,
  ) {}

  async getProject(userId: string, projectId: string): Promise<ProjectEntity> {
    const user = await this.userService.findById(userId);
    const projects = await this.projectRepository.find({
      where: {
        id: projectId,
        user,
      },
    });

    if (projects && projects[0]) {
      return projects[0];
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
