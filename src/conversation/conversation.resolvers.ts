import { Args, Resolver, Mutation, Query, Subscription } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from '../common/decorators/currentUser.decorator';
import { IAuthCurrentUserPayload } from '../auth/jwt.strategy';
import { ConversationEntity } from './conversation.entity';
import { ConversationCreateInput } from './conversation.inputs';
import { ConversationService } from './conversation.service';
import { PubSubService } from '../common/services/pubsub.service';

enum ETriggers {
  ConversationCreated = 'conversationCreated',
}

@Resolver(of => ConversationEntity)
export class ConversationResolvers {
  constructor(
    private readonly pubSubService: PubSubService,
    private readonly conversationService: ConversationService,
  ) {}

  @Query(returns => ConversationEntity)
  @UseGuards(GqlAuthGuard)
  async getConversation(
    @CurrentUser() user: IAuthCurrentUserPayload,
    @Args('conversationId') conversationId: string,
  ): Promise<ConversationEntity> {
    return await this.conversationService.getConversation(user.id, conversationId); // TODO: Only users that have access to specified documents
  }

  @Query(returns => [ConversationEntity])
  @UseGuards(GqlAuthGuard)
  async getConversations(
    @CurrentUser() user: IAuthCurrentUserPayload,
    @Args('documentId') documentId: string,
  ): Promise<ConversationEntity[]> {
    return await this.conversationService.findConversations(user.id, documentId); // TODO: Only users that have access to specified documents
  }

  @Mutation(returns => ConversationEntity)
  @UseGuards(GqlAuthGuard)
  async createConversation(
    @CurrentUser() user: IAuthCurrentUserPayload,
    @Args('documentId') documentId: string,
    @Args('input') input: ConversationCreateInput,
  ): Promise<ConversationEntity> {
    const createdConversation = await this.conversationService.create(user.id, documentId, input);
    await this.pubSubService.pubSub.publish(ETriggers.ConversationCreated, { conversationCreated: createdConversation });
    return createdConversation;
  }

  @Subscription(returns => ConversationEntity)
  conversationCreated() {
    return this.pubSubService.pubSub.asyncIterator(ETriggers.ConversationCreated); // TODO: Only users that have access to specified documents
  }
}
