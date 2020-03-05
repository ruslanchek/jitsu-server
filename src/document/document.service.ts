import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { DocumentEntity } from './document.entity';
import { ProjectService } from '../project/project.service';
import { EErrorMessage } from '../messages';
import { DocumentChangeInput, DocumentCreateInput } from './document.inputs';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(DocumentEntity)
    private readonly documentRepository: Repository<DocumentEntity>,
    private readonly userService: UserService,
    private readonly projectService: ProjectService,
  ) {}

  async getDocument(userId: string, documentId: string): Promise<DocumentEntity> {
    return await this.findById(documentId);
  }

  async findDocuments(userId: string, projectId: string): Promise<DocumentEntity[]> {
    const project = await this.projectService.getProject(userId, projectId);
    const user = await this.userService.findById(userId);
    return await this.documentRepository.find({
      where: {
        user,
        project,
      }
    });
  }

  async findById(id: string, select?: Array<keyof DocumentEntity>): Promise<DocumentEntity | undefined> {
    const items = await this.documentRepository.find({
      where: {
        id,
      },
      select,
    });

    return items.length > 0 ? items[0] : undefined;
  }

  async create(
    userId: string,
    projectId: string,
    input: DocumentCreateInput,
  ): Promise<DocumentEntity> {
    const project = await this.projectService.getProject(userId, projectId);
    const user = await this.userService.findById(userId);

    if (!project || !user) {
      throw new NotFoundException(EErrorMessage.DocumentNotFound);
    }

    const result = await this.documentRepository.insert({
      ...input,
      project,
      user,
    });
    return await this.findById(result.identifiers[0].id);
  }

  async change(
    userId: string,
    documentId: string,
    input: DocumentChangeInput,
  ): Promise<DocumentEntity> {
    const document = await this.findById(documentId);
    const user = await this.userService.findById(userId);

    if (!document) {
      throw new NotFoundException(EErrorMessage.DocumentNotFound);
    }

    await this.documentRepository.update({ id: documentId, user }, { ...input });
    return await this.findById(documentId);
  }
}
