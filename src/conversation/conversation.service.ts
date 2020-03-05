import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EErrorMessage } from '../messages';
import { ConversationEntity } from './conversation.entity';
import { ConversationCreateInput } from './conversation.inputs';
import { UserService } from '../user/user.service';
import { DocumentService } from '../document/document.service';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(ConversationEntity)
    private readonly conversationRepository: Repository<ConversationEntity>,
    private readonly userService: UserService,
    private readonly documentService: DocumentService,
  ) {}

  async getConversation(userId: string, conversationId: string): Promise<ConversationEntity> {
    const user = await this.userService.findById(userId);
    const conversations = await this.conversationRepository.find({
      where: {
        id: conversationId,
        user,
      },
    });

    if (conversations && conversations[0]) {
      return conversations[0];
    }

    throw new NotFoundException(EErrorMessage.ConversationNotFound);
  }

  async findConversations(userId: string, documentId: string): Promise<ConversationEntity[]> {
    const document = await this.documentService.getDocument(userId, documentId);
    const user = await this.userService.findById(userId);

    if (!document || !user) {
      throw new NotFoundException(EErrorMessage.DocumentNotFound);
    }

    return await this.conversationRepository.find({
      document,
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
    return await this.getConversation(user.id, result.identifiers[0].id);
  }
}
