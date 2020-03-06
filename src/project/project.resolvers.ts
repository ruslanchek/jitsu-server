import { Args, Resolver, Mutation, Query, Subscription } from '@nestjs/graphql';
import { ProjectService } from './project.service';
import { ProjectEntity } from './project.entity';
import { ProjectCreateInput } from './project.inputs';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from '../common/decorators/currentUser.decorator';
import { IAuthCurrentUserPayload } from '../auth/jwt.strategy';
import { PubSub } from 'graphql-subscriptions';
import { EPubSubTriggers, PubSubService } from '../common/services/pubsub.service';

@Resolver(of => ProjectEntity)
export class ProjectResolvers {
  constructor(private readonly pubSubService: PubSubService, private readonly projectService: ProjectService) {}

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
    await this.pubSubService.pubSub.publish(EPubSubTriggers.ProjectCreated, { projectCreated: createdProject });
    return createdProject;
  }

  @Subscription(returns => ProjectEntity)
  projectCreated() {
    return this.pubSubService.pubSub.asyncIterator(EPubSubTriggers.ProjectCreated);
  }
}
