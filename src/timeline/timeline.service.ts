import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { TimelineEntity } from './timeline.entity';
import { EErrorMessage } from '../messages';
import { TimelineCreateInput } from './timeline.inputs';
import { DocumentService } from '../document/document.service';
import { EPubSubTriggers, PubSubService } from '../common/services/pubsub.service';

export enum ETimelineEventName {
  DocumentCreated = 'documentCreated',
}

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
    const timeline = await this.timelineRepository.findOne({
      where: {
        id: documentId,
        user,
      },
    });
    if (timeline) {
      return timeline;
    }
    throw new NotFoundException(EErrorMessage.TimelineNotFound);
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
    const timelineCreated = await this.getTimeline(user.id, result.identifiers[0].id);
    await this.pubSubService.pubSub.publish(EPubSubTriggers.TimelineCreated, { timelineCreated });
    return timelineCreated;
  }
}
