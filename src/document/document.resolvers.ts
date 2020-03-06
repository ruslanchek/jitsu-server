import { Args, Resolver, Mutation, Query, Subscription } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from '../common/decorators/currentUser.decorator';
import { IAuthCurrentUserPayload } from '../auth/jwt.strategy';
import { DocumentService } from './document.service';
import { DocumentEntity } from './document.entity';
import { DocumentChangeInput, DocumentCreateInput } from './document.inputs';
import { EPubSubTriggers, PubSubService } from '../common/services/pubsub.service';

@Resolver(of => DocumentEntity)
export class DocumentResolvers {
  constructor(private readonly pubSubService: PubSubService, private readonly documentService: DocumentService) {}

  @Query(returns => DocumentEntity)
  @UseGuards(GqlAuthGuard)
  async getDocument(
    @CurrentUser() user: IAuthCurrentUserPayload,
    @Args('documentId') documentId: string,
  ): Promise<DocumentEntity> {
    return await this.documentService.getDocument(user.id, documentId);
  }

  @Query(returns => [DocumentEntity])
  @UseGuards(GqlAuthGuard)
  async getDocuments(
    @CurrentUser() user: IAuthCurrentUserPayload,
    @Args('projectId') projectId: string,
  ): Promise<DocumentEntity[]> {
    return await this.documentService.findDocuments(user.id, projectId);
  }

  @Mutation(returns => DocumentEntity)
  @UseGuards(GqlAuthGuard)
  async createDocument(
    @CurrentUser() user: IAuthCurrentUserPayload,
    @Args('projectId') projectId: string,
    @Args('input') input: DocumentCreateInput,
  ): Promise<DocumentEntity> {
    const createdDocument = await this.documentService.create(user.id, projectId, input);
    await this.pubSubService.pubSub.publish(EPubSubTriggers.DocumentCreated, { documentCreated: createdDocument });
    return createdDocument;
  }

  @Mutation(returns => DocumentEntity)
  @UseGuards(GqlAuthGuard)
  async changeDocument(
    @CurrentUser() user: IAuthCurrentUserPayload,
    @Args('documentId') documentId: string,
    @Args('input') input: DocumentChangeInput,
  ): Promise<DocumentEntity> {
    const changedDocument = await this.documentService.change(user.id, documentId, input);
    await this.pubSubService.pubSub.publish(EPubSubTriggers.DocumentChanged, { documentChanged: changedDocument });
    return changedDocument;
  }

  @Subscription(returns => DocumentEntity)
  documentCreated() {
    return this.pubSubService.pubSub.asyncIterator(EPubSubTriggers.DocumentCreated);
  }

  @Subscription(returns => DocumentEntity)
  documentChanged() {
    return this.pubSubService.pubSub.asyncIterator(EPubSubTriggers.DocumentChanged);
  }
}
