import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { TimelineEntity } from './timeline.entity';
import { EErrorMessage } from '../messages';
import { TimelineCreateInput } from './timeline.inputs';
import { DocumentService } from '../document/document.service';
import { EPubSubTriggers, PubSubService } from '../common/services/pubsub.service';

@Injectable()
export class TimelineService {
  constructor(
    @InjectRepository(TimelineEntity)
    private readonly timelineRepository: Repository<TimelineEntity>,
    private readonly userService: UserService,
    private readonly documentService: DocumentService,
    private readonly pubSubService: PubSubService,
  ) {}

  async getTimeline(userId: string, documentId: string): Promise<TimelineEntity> {
    const user = await this.userService.findById(userId);
    const documents = await this.timelineRepository.find({
      where: {
        id: documentId,
        user,
      },
    });
    if (documents && documents[0]) {
      return documents[0];
    }
    throw new NotFoundException(EErrorMessage.DocumentNotFound);
  }

  async findTimelines(userId: string, documentId: string): Promise<TimelineEntity[]> {
    const user = await this.userService.findById(userId);
    const document = await this.documentService.getDocument(user.id, documentId);
    return await this.timelineRepository.find({
      where: {
        document,
        user,
      },
    });
  }

  async create(userId: string, documentId: string, input: TimelineCreateInput): Promise<TimelineEntity> {
    const document = await this.documentService.getDocument(userId, documentId);
    const user = await this.userService.findById(userId);
    const result = await this.timelineRepository.insert({
      ...input,
      document,
      user,
    });
    const createdTimeline = await this.getTimeline(user.id, result.identifiers[0].id);
    await this.pubSubService.pubSub.publish(EPubSubTriggers.TimelineCreated, { timelineCreated: createdTimeline });
    return createdTimeline;
  }
}
