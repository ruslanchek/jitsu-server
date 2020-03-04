import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EErrorMessage } from '../messages';
import { ConversationEntity } from './conversation.entity';
import { ConversationCreateInput, ConversationGetByIdInput } from './conversation.inputs';
import { DocumentGetByIdInput } from '../document/document.inputs';
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

  async getConversation(userId: string, conversationIdInput: ConversationGetByIdInput): Promise<ConversationEntity> {
    return await this.findById(conversationIdInput.id);
  }

  async findConversations(userId: string, documentIdInput: DocumentGetByIdInput): Promise<ConversationEntity[]> {
    const document = await this.documentService.getDocument(userId, documentIdInput);
    const user = await this.userService.findById(userId);

    if (!document || !user) {
      throw new NotFoundException(EErrorMessage.DocumentNotFound);
    }

    return await this.conversationRepository.find({
      document,
    });
  }

  async findById(id: string, select?: Array<keyof ConversationEntity>): Promise<ConversationEntity | undefined> {
    const items = await this.conversationRepository.find({
      where: {
        id,
      },
      select,
    });
    return items.length > 0 ? items[0] : undefined;
  }

  async create(
    userId: string,
    documentIdInput: DocumentGetByIdInput,
    input: ConversationCreateInput,
  ): Promise<ConversationEntity> {
    const document = await this.documentService.getDocument(userId, documentIdInput);
    const user = await this.userService.findById(userId);

    if (!document || !user) {
      throw new NotFoundException(EErrorMessage.DocumentNotFound);
    }

    const result = await this.conversationRepository.insert({
      ...input,
      document,
      user,
    });
    return await this.findById(result.identifiers[0].id);
  }
}
