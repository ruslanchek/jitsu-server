import { Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

export enum EPubSubTriggers {
  ConversationCreated = 'conversationCreated',
  DocumentCreated = 'documentCreated',
  DocumentChanged = 'documentChanged',
  ProjectCreated = 'projectCreated',
  ProjectChanged = 'projectChanged',
  TimelineCreated = 'timelineCreated',
  InviteCreated = 'inviteCreated',
}

const pubSub = new PubSub();

@Injectable()
export class PubSubService {
  public readonly pubSub = pubSub;
}