import { Args, Resolver, Mutation, Query, Subscription } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from '../common/decorators/currentUser.decorator';
import { IAuthCurrentUserPayload } from '../auth/jwt.strategy';
import { DocumentService } from './document.service';
import { DocumentEntity } from './document.entity';
import { DocumentChangeInput, DocumentCreateInput } from './document.inputs';
import { EPubSubTriggers, PubSubService } from '../common/services/pubsub.service';
import { ETimelineEventName, TimelineService } from '../timeline/timeline.service';

@Resolver((of) => DocumentEntity)
export class DocumentResolvers {
  constructor(
    private readonly pubSubService: PubSubService,
    private readonly documentService: DocumentService,
    private readonly timelineService: TimelineService,
  ) {}

  @Query((returns) => DocumentEntity)
  @UseGuards(GqlAuthGuard)
  async getDocument(
    @CurrentUser() user: IAuthCurrentUserPayload,
    @Args('documentId') documentId: string,
  ): Promise<DocumentEntity> {
    return await this.documentService.getDocument(user.id, documentId);
  }

  @Query((returns) => [DocumentEntity])
  @UseGuards(GqlAuthGuard)
  async getDocuments(
    @CurrentUser() user: IAuthCurrentUserPayload,
    @Args('projectId') projectId: string,
  ): Promise<DocumentEntity[]> {
    return await this.documentService.findDocuments(user.id, projectId);
  }

  @Mutation((returns) => DocumentEntity)
  @UseGuards(GqlAuthGuard)
  async createDocument(
    @CurrentUser() user: IAuthCurrentUserPayload,
    @Args('projectId') projectId: string,
    @Args('input') input: DocumentCreateInput,
  ): Promise<DocumentEntity> {
    const createdDocument = await this.documentService.create(user.id, projectId, input);
    await this.timelineService.create(user.id, createdDocument.id, {
      eventName: ETimelineEventName.DocumentCreated,
      date: new Date(),
    });
    return createdDocument;
  }

  @Mutation((returns) => DocumentEntity)
  @UseGuards(GqlAuthGuard)
  async changeDocument(
    @CurrentUser() user: IAuthCurrentUserPayload,
    @Args('documentId') documentId: string,
    @Args('input') input: DocumentChangeInput,
  ): Promise<DocumentEntity> {
    return await this.documentService.change(user.id, documentId, input);
  }

  @Subscription((returns) => DocumentEntity, {
    filter: (a, b, c) => {
      console.log(a, b, c);
      return true;
    },
  })
  documentCreated() {
    return this.pubSubService.pubSub.asyncIterator(EPubSubTriggers.DocumentCreated);
  }

  @Subscription((returns) => DocumentEntity)
  documentChanged() {
    return this.pubSubService.pubSub.asyncIterator(EPubSubTriggers.DocumentChanged);
  }
}
