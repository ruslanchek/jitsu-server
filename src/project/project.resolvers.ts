import { Args, Resolver, Mutation, Query, Subscription } from '@nestjs/graphql';
import { ProjectService } from './project.service';
import { ProjectEntity } from './project.entity';
import { ProjectCreateInput } from './project.inputs';
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
    @Args('projectId') projectId: string,
  ): Promise<ProjectEntity> {
    return await this.projectService.getProject(user.id, projectId);
  }

  @Query(returns => [ProjectEntity])
  @UseGuards(GqlAuthGuard)
  async getProjects(@CurrentUser() user: IAuthCurrentUserPayload): Promise<ProjectEntity[]> {
    return await this.projectService.findProjects(user.id);
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
    return pubSub.asyncIterator(ETriggers.ProjectCreated);
  }
}
