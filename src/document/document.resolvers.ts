import { Args, Resolver, Mutation, Query, Subscription } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from '../common/decorators/currentUser.decorator';
import { IAuthCurrentUserPayload } from '../auth/jwt.strategy';
import { PubSub } from 'graphql-subscriptions';
import { DocumentService } from './document.service';
import { DocumentEntity } from './document.entity';
import {
  DocumentChangeInput,
  DocumentCreateInput,
  DocumentGetByIdInput,
} from './document.inputs';
import { ProjectGetByIdInput } from '../project/project.inputs';

const pubSub = new PubSub();

enum ETriggers {
  DocumentCreated = 'documentCreated',
  DocumentChanged = 'documentChanged',
}

@Resolver(of => DocumentEntity)
export class DocumentResolvers {
  constructor(private readonly documentService: DocumentService) {}

  @Query(returns => DocumentEntity)
  @UseGuards(GqlAuthGuard)
  async getDocument(
    @CurrentUser() user: IAuthCurrentUserPayload,
    @Args('input') input: DocumentGetByIdInput,
  ): Promise<DocumentEntity> {
    return await this.documentService.getDocument(user.id, input); // TODO: Only users that have access to specified documents
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
    @Args('projectIdInput') projectIdInput: ProjectGetByIdInput,
    @Args('input') input: DocumentCreateInput,
  ): Promise<DocumentEntity> {
    const createdDocument = await this.documentService.create(user.id, projectIdInput, input);
    await pubSub.publish(ETriggers.DocumentCreated, { documentCreated: createdDocument });
    return createdDocument;
  }

  @Mutation(returns => DocumentEntity)
  @UseGuards(GqlAuthGuard)
  async changeDocument(
    @CurrentUser() user: IAuthCurrentUserPayload,
    @Args('getByIdInput') getByIdInput: DocumentGetByIdInput,
    @Args('input') input: DocumentChangeInput,
  ): Promise<DocumentEntity> {
    const changedDocument = await this.documentService.change(user.id, getByIdInput, input);
    await pubSub.publish(ETriggers.DocumentChanged, { documentChanged: changedDocument });
    return changedDocument;
  }

  @Subscription(returns => DocumentEntity)
  documentCreated() {
    return pubSub.asyncIterator(ETriggers.DocumentCreated); // TODO: Only users that have access to specified documents
  }

  @Subscription(returns => DocumentEntity)
  documentChanged() {
    return pubSub.asyncIterator(ETriggers.DocumentChanged); // TODO: Only users that have access to specified documents
  }
}
