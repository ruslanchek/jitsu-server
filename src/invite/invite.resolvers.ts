import { Args, Resolver, Mutation, Query, Subscription } from '@nestjs/graphql';
import { PubSubService } from '../common/services/pubsub.service';
import { InviteEntity } from './invite.entity';
import { InviteService } from './invite.service';

@Resolver(of => InviteEntity)
export class InviteResolvers {
  constructor(
    private readonly pubSubService: PubSubService,
    private readonly inviteService: InviteService,
  ) {}

}
