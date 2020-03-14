import { Args, Resolver, Mutation } from '@nestjs/graphql';
import { PubSubService } from '../common/services/pubsub.service';
import { InviteEntity } from './invite.entity';
import { InviteService } from './invite.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../common/decorators/currentUser.decorator';
import { IAuthCurrentUserPayload } from '../auth/jwt.strategy';
import { InviteCreateInput } from './invite.inputs';

@Resolver(of => InviteEntity)
export class InviteResolvers {
  constructor(private readonly pubSubService: PubSubService, private readonly inviteService: InviteService) {}

  @Mutation(returns => InviteEntity)
  @UseGuards(GqlAuthGuard)
  async createInvite(
    @CurrentUser() user: IAuthCurrentUserPayload,
    @Args('projectId') projectId: string,
    @Args('input') input: InviteCreateInput,
  ): Promise<InviteEntity> {
    return await this.inviteService.create(user.id, projectId, input);
  }
}
