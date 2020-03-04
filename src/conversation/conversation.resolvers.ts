import { Args, Resolver, Mutation, Query, Subscription } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from '../common/decorators/currentUser.decorator';
import { IAuthCurrentUserPayload } from '../auth/jwt.strategy';
import { PubSub } from 'graphql-subscriptions';
import { ProjectGetByIdInput } from '../project/project.inputs';
import { ConversationEntity } from './conversation.entity';
import { ConversationCreateInput, ConversationGetByIdInput } from './conversation.inputs';
import { ConversationService } from './conversation.service';
import { DocumentGetByIdInput } from '../document/document.inputs';

const pubSub = new PubSub();

enum ETriggers {
  ConversationCreated = 'conversationCreated',
}

@Resolver(of => ConversationEntity)
export class ConversationResolvers {
  constructor(private readonly conversationService: ConversationService) {}

  @Query(returns => ConversationEntity)
  @UseGuards(GqlAuthGuard)
  async getConversation(
    @CurrentUser() user: IAuthCurrentUserPayload,
    @Args('input') input: ConversationGetByIdInput,
  ): Promise<ConversationEntity> {
    return await this.conversationService.getConversation(user.id, input); // TODO: Only users that have access to specified documents
  }

  @Query(returns => [ConversationEntity])
  @UseGuards(GqlAuthGuard)
  async getConversations(
    @CurrentUser() user: IAuthCurrentUserPayload,
    @Args('documentIdInput') documentIdInput: DocumentGetByIdInput,
  ): Promise<ConversationEntity[]> {
    return await this.conversationService.findConversations(user.id, documentIdInput); // TODO: Only users that have access to specified documents
  }

  @Mutation(returns => ConversationEntity)
  @UseGuards(GqlAuthGuard)
  async createConversation(
    @CurrentUser() user: IAuthCurrentUserPayload,
    @Args('documentIdInput') documentIdInput: DocumentGetByIdInput,
    @Args('input') input: ConversationCreateInput,
  ): Promise<ConversationEntity> {
    const createdConversation = await this.conversationService.create(user.id, documentIdInput, input);
    await pubSub.publish(ETriggers.ConversationCreated, { conversationCreated: createdConversation });
    return createdConversation;
  }

  @Subscription(returns => ConversationEntity)
  conversationCreated() {
    return pubSub.asyncIterator(ETriggers.ConversationCreated); // TODO: Only users that have access to specified documents
  }
}
