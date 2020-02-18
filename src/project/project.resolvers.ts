import { Args, Resolver, Query, Mutation } from '@nestjs/graphql';
import { ProjectService } from './project.service';
import { ProjectEntity } from './project.entity';
import {  } from './project.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from '../common/decorators/currentUser.decorator';
import { IAuthCurrentUserPayload } from '../auth/jwt.strategy';

@Resolver(of => ProjectEntity)
export class ProjectResolvers {
  constructor(private readonly projectService: ProjectService) {}
}
