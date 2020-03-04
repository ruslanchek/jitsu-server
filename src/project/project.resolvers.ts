import { Args, Resolver, Mutation, Query, Subscription } from '@nestjs/graphql';
import { ProjectService } from './project.service';
import { ProjectEntity } from './project.entity';
import { ProjectCreateInput, ProjectGetByIdInput } from './project.inputs';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from '../common/decorators/currentUser.decorator';
import { IAuthCurrentUserPayload } from '../auth/jwt.strategy';
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();

enum ETriggers {
  ProjectCreated = 'projectCreated',
}

@Resolver(of => ProjectEntity)
export class ProjectResolvers {
  constructor(private readonly projectService: ProjectService) {}

  @Query(returns => ProjectEntity)
  @UseGuards(GqlAuthGuard)
  async getProject(
    @CurrentUser() user: IAuthCurrentUserPayload,
    @Args('input') input: ProjectGetByIdInput,
  ): Promise<ProjectEntity> {
    return await this.projectService.getProject(user.id, input); // TODO: Only users that have access to specified projects
  }

  @Query(returns => [ProjectEntity])
  @UseGuards(GqlAuthGuard)
  async getMyProjects(@CurrentUser() user: IAuthCurrentUserPayload): Promise<ProjectEntity[]> {
    return await this.projectService.findProjects(user.id); // TODO: Only users that have access to specified projects
  }

  @Mutation(returns => ProjectEntity)
  @UseGuards(GqlAuthGuard)
  async createProject(
    @CurrentUser() user: IAuthCurrentUserPayload,
    @Args('input') input: ProjectCreateInput,
  ): Promise<ProjectEntity> {
    const createdProject = await this.projectService.create(user.id, input);
    await pubSub.publish(ETriggers.ProjectCreated, { projectCreated: createdProject });
    return createdProject;
  }

  @Subscription(returns => ProjectEntity)
  projectCreated() {
    return pubSub.asyncIterator(ETriggers.ProjectCreated); // TODO: Only users that have access to specified projects
  }
}
