import { Args, Resolver, Mutation, Query } from '@nestjs/graphql';
import { PubSubService } from '../common/services/pubsub.service';
import { InviteEntity } from './invite.entity';
import { InviteService } from './invite.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../common/decorators/currentUser.decorator';
import { IAuthCurrentUserPayload } from '../auth/jwt.strategy';
import { InviteCreateInput } from './invite.inputs';

@Resolver((of) => InviteEntity)
export class InviteResolvers {
  constructor(private readonly pubSubService: PubSubService, private readonly inviteService: InviteService) {}

  @Query((returns) => InviteEntity)
  async getInvite(
    @Args('inviteCode') inviteCode: string,
  ): Promise<InviteEntity> {
    return await this.inviteService.getInviteByCode(inviteCode);
  }

  @Query((returns) => [InviteEntity])
  @UseGuards(GqlAuthGuard)
  async getInvites(
    @CurrentUser() user: IAuthCurrentUserPayload,
    @Args('projectId') projectId: string,
  ): Promise<InviteEntity[]> {
    return await this.inviteService.findInvites(user.id, projectId);
  }

  @Mutation((returns) => InviteEntity)
  @UseGuards(GqlAuthGuard)
  async createInvite(
    @CurrentUser() user: IAuthCurrentUserPayload,
    @Args('projectId') projectId: string,
    @Args('input') input: InviteCreateInput,
  ): Promise<InviteEntity> {
    return await this.inviteService.create(user.id, projectId, input);
  }

  @Query((returns) => InviteEntity)
  @UseGuards(GqlAuthGuard)
  async resendInvite(
    @CurrentUser() user: IAuthCurrentUserPayload,
    @Args('inviteId') inviteId: string,
  ): Promise<InviteEntity> {
    return await this.inviteService.resend(user.id, inviteId);
  }

  @Mutation((returns) => InviteEntity)
  @UseGuards(GqlAuthGuard)
  async acceptInvite(
    @CurrentUser() user: IAuthCurrentUserPayload,
    @Args('inviteCode') inviteCode: string,
  ): Promise<InviteEntity> {
    return await this.inviteService.accept(user.id, inviteCode);
  }
}
