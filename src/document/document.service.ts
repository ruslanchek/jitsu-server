import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { DocumentEntity } from './document.entity';
import { ProjectService } from '../project/project.service';
import { EErrorMessage } from '../messages';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(DocumentEntity)
    private readonly documentRepository: Repository<DocumentEntity>,
    private readonly userService: UserService,
    private readonly projectService: ProjectService,
  ) {}

  async getDocument(id: string, userId: string): Promise<DocumentEntity> {
    return await this.findById(id);
  }

  async findDocuments(userId: string): Promise<DocumentEntity[]> {
    return await this.documentRepository.find();
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

  async create(name: string, projectId: string, userId: string): Promise<DocumentEntity> {
    const project = await this.projectService.getUserProject(projectId, userId);

    if(!project) {
      throw new NotFoundException(EErrorMessage.ProjectNotFound);
    }

    const result = await this.documentRepository.insert({
      name,
      project,
    });
    return await this.findById(result.identifiers[0].id);
  }
}
