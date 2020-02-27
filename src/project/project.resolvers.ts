import { Args, Resolver, Mutation, Query, Subscription } from '@nestjs/graphql';
import { ProjectService } from './project.service';
import { ProjectEntity } from './project.entity';
import { ProjectCreateInput, ProjectGetByIdInput } from './project.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from '../common/decorators/currentUser.decorator';
import { IAuthCurrentUserPayload } from '../auth/jwt.strategy';
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();

@Resolver(of => ProjectEntity)
export class ProjectResolvers {
  constructor(private readonly projectService: ProjectService) {}

  @Query(returns => ProjectEntity)
  @UseGuards(GqlAuthGuard)
  async getProject(
    @CurrentUser() user: IAuthCurrentUserPayload,
    @Args('input') input: ProjectGetByIdInput,
  ): Promise<ProjectEntity> {
    return await this.projectService.getUserProject(input.id, user.id); // TODO: Only users that have access to specified projects
  }

  @Query(returns => [ProjectEntity])
  @UseGuards(GqlAuthGuard)
  async getMyProjects(@CurrentUser() user: IAuthCurrentUserPayload): Promise<ProjectEntity[]> {
    return await this.projectService.findUserProjects(user.id); // TODO: Only users that have access to specified projects
  }

  @Mutation(returns => ProjectEntity)
  @UseGuards(GqlAuthGuard)
  async createProject(
    @CurrentUser() user: IAuthCurrentUserPayload,
    @Args('input') input: ProjectCreateInput,
  ): Promise<ProjectEntity> {
    const createdProject = await this.projectService.create(input.name, user.id);
    await pubSub.publish('projectCreated', { projectCreated: createdProject });
    return createdProject;
  }

  @Subscription(returns => ProjectEntity)
  // @UseGuards(GqlAuthGuard)
  projectCreated() {
    return pubSub.asyncIterator('projectCreated'); // TODO: Only users that have access to specified projects
  }
}
