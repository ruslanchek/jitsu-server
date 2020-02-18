import { Args, Resolver, Mutation, Query } from '@nestjs/graphql';
import { ProjectService } from './project.service';
import { ProjectEntity } from './project.entity';
import { ProjectCreateInput } from './project.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from '../common/decorators/currentUser.decorator';
import { IAuthCurrentUserPayload } from '../auth/jwt.strategy';

@Resolver(of => ProjectEntity)
export class ProjectResolvers {
  constructor(private readonly projectService: ProjectService) {}

  @Query(returns => [ProjectEntity])
  @UseGuards(GqlAuthGuard)
  async getMyProjects(@CurrentUser() user: IAuthCurrentUserPayload): Promise<ProjectEntity[]> {
    return await this.projectService.findUserProjects(user.id);
  }

  @Mutation(returns => ProjectEntity)
  @UseGuards(GqlAuthGuard)
  async createProject(
    @CurrentUser() user: IAuthCurrentUserPayload,
    @Args('input') input: ProjectCreateInput,
  ): Promise<ProjectEntity> {
    return await this.projectService.create(input.name, user.id);
  }
}
