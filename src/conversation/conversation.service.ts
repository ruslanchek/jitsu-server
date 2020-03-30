import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EErrorMessage } from '../messages';
import { ConversationEntity } from './conversation.entity';
import { ConversationCreateInput } from './conversation.inputs';
import { UserService } from '../user/user.service';
import { DocumentService } from '../document/document.service';
import { EPubSubTriggers, PubSubService } from '../common/services/pubsub.service';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(ConversationEntity)
    private readonly conversationRepository: Repository<ConversationEntity>,
    private readonly userService: UserService,
    private readonly documentService: DocumentService,
    private readonly pubSubService: PubSubService,
  ) {}

  async getConversation(userId: string, conversationId: string): Promise<ConversationEntity> {
    const user = await this.userService.findById(userId);
    const conversation = await this.conversationRepository.findOne({
      join: { alias: 'conversation', innerJoinAndSelect: { user: 'conversation.user' } },
      where: {
        id: conversationId,
        user,
      },
    });
    if (conversation) {
      return conversation;
    }
    throw new NotFoundException(EErrorMessage.ConversationNotFound);
  }

  async findConversations(userId: string, documentId: string): Promise<ConversationEntity[]> {
    const user = await this.userService.findById(userId);
    const document = await this.documentService.getDocument(user.id, documentId);
    if (!document) {
      throw new NotFoundException(EErrorMessage.DocumentNotFound);
    }
    return this.conversationRepository.find({
      join: { alias: 'conversation', innerJoinAndSelect: { user: 'conversation.user' } },
      where: {
        document,
      },
    });
  }

  async create(userId: string, documentId: string, input: ConversationCreateInput): Promise<ConversationEntity> {
    const document = await this.documentService.getDocument(userId, documentId);
    const user = await this.userService.findById(userId);

    if (!document || !user) {
      throw new NotFoundException(EErrorMessage.DocumentNotFound);
    }

    const result = await this.conversationRepository.insert({
      ...input,
      document,
      user,
    });
    const conversationCreated = await this.getConversation(user.id, result.identifiers[0].id);
    await this.pubSubService.pubSub.publish(EPubSubTriggers.ConversationCreated, {
      conversationCreated,
    });
    return conversationCreated;
  }
}
