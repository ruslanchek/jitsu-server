import { Args, Resolver, Mutation, Query, Subscription } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from '../common/decorators/currentUser.decorator';
import { IAuthCurrentUserPayload } from '../auth/jwt.strategy';
import { ConversationEntity } from './conversation.entity';
import { ConversationCreateInput } from './conversation.inputs';
import { ConversationService } from './conversation.service';
import { EPubSubTriggers, PubSubService } from '../common/services/pubsub.service';

@Resolver((of) => ConversationEntity)
export class ConversationResolvers {
  constructor(
    private readonly pubSubService: PubSubService,
    private readonly conversationService: ConversationService,
  ) {}

  @Query((returns) => ConversationEntity)
  @UseGuards(GqlAuthGuard)
  async getConversation(
    @CurrentUser() user: IAuthCurrentUserPayload,
    @Args('conversationId') conversationId: string,
  ): Promise<ConversationEntity> {
    return await this.conversationService.getConversation(user.id, conversationId);
  }

  @Query((returns) => [ConversationEntity])
  @UseGuards(GqlAuthGuard)
  async getConversations(
    @CurrentUser() user: IAuthCurrentUserPayload,
    @Args('documentId') documentId: string,
  ): Promise<ConversationEntity[]> {
    return await this.conversationService.findConversations(user.id, documentId);
  }

  @Mutation((returns) => ConversationEntity)
  @UseGuards(GqlAuthGuard)
  async createConversation(
    @CurrentUser() user: IAuthCurrentUserPayload,
    @Args('documentId') documentId: string,
    @Args('input') input: ConversationCreateInput,
  ): Promise<ConversationEntity> {
    return await this.conversationService.create(user.id, documentId, input);
  }

  @Subscription((returns) => ConversationEntity)
  conversationCreated() {
    return this.pubSubService.pubSub.asyncIterator(EPubSubTriggers.ConversationCreated);
  }
}
