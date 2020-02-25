import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectEntity } from './project.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
    private readonly userService: UserService,
  ) {}

  async getUserProject(id: string, userId: string): Promise<ProjectEntity> {
    return await this.findById(id);
  }

  async findUserProjects(userId: string): Promise<ProjectEntity[]> {
    const user = await this.userService.findById(userId, ['id'], ['projects', 'invitedToProjects']);
    return user.projects;
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

  async create(name: string, userId: string): Promise<ProjectEntity> {
    const user = await this.userService.findById(userId);
    const result = await this.projectRepository.insert({
      user,
      name,
    });
    return await this.findById(result.identifiers[0].id);
  }
}
