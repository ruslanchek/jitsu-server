import { Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

export enum EPubSubTriggers {
  ConversationCreated = 'conversationCreated',
  DocumentCreated = 'documentCreated',
  DocumentChanged = 'documentChanged',
  ProjectCreated = 'projectCreated',
  TimelineCreated = 'timelineCreated',
}

@Injectable()
export class PubSubService {
  public readonly pubSub = new PubSub();
}