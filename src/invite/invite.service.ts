import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { InviteEntity } from './invite.entity';
import { ProjectService } from '../project/project.service';
import { EErrorMessage } from '../messages';
import { EPubSubTriggers, PubSubService } from '../common/services/pubsub.service';
import { Repository } from 'typeorm';

@Injectable()
export class InviteService {
  constructor(
    @InjectRepository(InviteEntity)
    private readonly inviteRepository: Repository<InviteEntity>,
    private readonly userService: UserService,
    private readonly projectService: ProjectService,
    private readonly pubSubService: PubSubService,
  ) {}

  async create(userId: string, invitedEmail) {

  }
}
