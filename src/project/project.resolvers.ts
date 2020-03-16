import { Args, Resolver, Mutation, Query, Subscription } from '@nestjs/graphql';
import { ProjectService } from './project.service';
import { ProjectEntity } from './project.entity';
import { ProjectChangeInput, ProjectCreateInput, ProjectFileInput } from './project.inputs';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from '../common/decorators/currentUser.decorator';
import { IAuthCurrentUserPayload } from '../auth/jwt.strategy';
import { EPubSubTriggers, PubSubService } from '../common/services/pubsub.service';
import { UploadScalar } from '../common/scalars/upload.scalar';

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
    return await this.projectService.create(user.id, input);
  }

  @Mutation(returns => ProjectEntity)
  @UseGuards(GqlAuthGuard)
  async changeProject(
    @CurrentUser() user: IAuthCurrentUserPayload,
    @Args('projectId') projectId: string,
    @Args('input') input: ProjectChangeInput,
  ): Promise<ProjectEntity> {
    return await this.projectService.change(user.id, projectId, input);
  }

  @Mutation(returns => String)
  async addImage(
    @CurrentUser() user: IAuthCurrentUserPayload,
    @Args('input') input: ProjectFileInput,
  ): Promise<string> {
    // console.log(input);
    return '';
  }

  @Subscription(returns => ProjectEntity)
  projectCreated() {
    return this.pubSubService.pubSub.asyncIterator(EPubSubTriggers.ProjectCreated);
  }

  @Subscription(returns => ProjectEntity)
  projectChanged() {
    return this.pubSubService.pubSub.asyncIterator(EPubSubTriggers.ProjectChanged);
  }
}
