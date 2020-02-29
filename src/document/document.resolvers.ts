import { Args, Resolver, Mutation, Query, Subscription } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from '../common/decorators/currentUser.decorator';
import { IAuthCurrentUserPayload } from '../auth/jwt.strategy';
import { PubSub } from 'graphql-subscriptions';
import { DocumentService } from './document.service';
import { DocumentEntity } from './document.entity';
import { DocumentCreateInput, DocumentGetByIdInput } from './document.input';

const pubSub = new PubSub();

@Resolver(of => DocumentEntity)
export class DocumentResolvers {
  constructor(private readonly documentService: DocumentService) {}

  @Query(returns => DocumentEntity)
  @UseGuards(GqlAuthGuard)
  async getDocument(
    @CurrentUser() user: IAuthCurrentUserPayload,
    @Args('input') input: DocumentGetByIdInput,
  ): Promise<DocumentEntity> {
    return await this.documentService.getDocument(input.id, user.id); // TODO: Only users that have access to specified documents
  }

  @Query(returns => [DocumentEntity])
  @UseGuards(GqlAuthGuard)
  async getDocuments(@CurrentUser() user: IAuthCurrentUserPayload): Promise<DocumentEntity[]> {
    return await this.documentService.findDocuments(user.id); // TODO: Only users that have access to specified documents
  }

  @Mutation(returns => DocumentEntity)
  @UseGuards(GqlAuthGuard)
  async createDocument(
    @CurrentUser() user: IAuthCurrentUserPayload,
    @Args('input') input: DocumentCreateInput,
  ): Promise<DocumentEntity> {
    const createdDocument = await this.documentService.create(input.name, input.projectId, user.id);
    await pubSub.publish('documentCreated', { documentCreated: createdDocument });
    return createdDocument;
  }

  @Subscription(returns => DocumentEntity)
  documentCreated() {
    return pubSub.asyncIterator('documentCreated'); // TODO: Only users that have access to specified documents
  }
}
