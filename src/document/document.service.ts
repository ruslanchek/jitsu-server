import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { DocumentEntity } from './document.entity';
import { ProjectService } from '../project/project.service';
import { EErrorMessage } from '../messages';
import { DocumentChangeInput, DocumentCreateInput } from './document.inputs';
import { EPubSubTriggers, PubSubService } from '../common/services/pubsub.service';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(DocumentEntity)
    private readonly documentRepository: Repository<DocumentEntity>,
    private readonly userService: UserService,
    private readonly projectService: ProjectService,
    private readonly pubSubService: PubSubService,
  ) {}

  async getDocument(userId: string, documentId: string): Promise<DocumentEntity> {
    const user = await this.userService.findById(userId);
    const document = await this.documentRepository.findOne({
      where: {
        id: documentId,
      },
    });
    try {
      const project = await this.projectService.getProject(user.id, (await document.project).id);
      if (project && document) {
        return document;
      }
    } catch (e) {
      console.log(e)
    }
    throw new NotFoundException(EErrorMessage.DocumentNotFound);
  }

  async findDocuments(userId: string, projectId: string): Promise<DocumentEntity[]> {
    const user = await this.userService.findById(userId);
    const project = await this.projectService.getProject(user.id, projectId);
    return await this.documentRepository.find({
      where: {
        project,
      },
    });
  }

  async create(userId: string, projectId: string, input: DocumentCreateInput): Promise<DocumentEntity> {
    const project = await this.projectService.getProject(userId, projectId);
    const user = await this.userService.findById(userId);
    const result = await this.documentRepository.insert({
      ...input,
      project,
      user,
    });
    const documentCreated = await this.getDocument(user.id, result.identifiers[0].id);
    await this.pubSubService.pubSub.publish(EPubSubTriggers.DocumentCreated, { documentCreated });
    return documentCreated;
  }

  async change(userId: string, documentId: string, input: DocumentChangeInput): Promise<DocumentEntity> {
    const user = await this.userService.findById(userId);
    const document = await this.getDocument(user.id, documentId);
    if (!document) {
      throw new NotFoundException(EErrorMessage.DocumentNotFound);
    }
    await this.documentRepository.update({ id: documentId, user }, input);
    const documentChanged = await this.getDocument(user.id, documentId);
    await this.pubSubService.pubSub.publish(EPubSubTriggers.DocumentChanged, { documentChanged });
    return documentChanged;
  }
}
