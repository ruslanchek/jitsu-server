import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectEntity } from './project.entity';
import { UserService } from '../user/user.service';
import { ProjectCreateInput } from './project.inputs';
import { EErrorMessage } from '../messages';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
    private readonly userService: UserService,
  ) {}

  async getProject(userId: string, projectId: string): Promise<ProjectEntity> {
    const user = await this.userService.findById(userId);
    const projects = await this.projectRepository.find({
      where: {
        id: projectId,
        user,
      },
    });

    console.log(projects)

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

  async findById(id: string, select?: Array<keyof ProjectEntity>): Promise<ProjectEntity | undefined> {
    const items = await this.projectRepository.find({
      where: {
        id,
      },
      select,
    });

    return items.length > 0 ? items[0] : undefined;
  }

  async create(userId: string, input: ProjectCreateInput): Promise<ProjectEntity> {
    const user = await this.userService.findById(userId);
    const result = await this.projectRepository.insert({
      ...input,
      user,
    });
    return await this.findById(result.identifiers[0].id);
  }
}
