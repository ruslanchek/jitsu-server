import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { InviteEntity } from './invite.entity';
import { ProjectService } from '../project/project.service';
import { EPubSubTriggers, PubSubService } from '../common/services/pubsub.service';
import { Repository } from 'typeorm';
import { InviteCreateInput } from './invite.inputs';
import { EErrorMessage } from '../messages';

@Injectable()
export class InviteService {
  constructor(
    @InjectRepository(InviteEntity)
    private readonly inviteRepository: Repository<InviteEntity>,
    private readonly userService: UserService,
    private readonly projectService: ProjectService,
    private readonly pubSubService: PubSubService,
  ) {}

  async getInvite(userId: string, inviteId: string): Promise<InviteEntity> {
    const user = await this.userService.findById(userId);
    const invite = await this.inviteRepository.findOne({
      where: {
        id: inviteId,
        user,
      },
    });
    if (invite) {
      return invite;
    }
    throw new NotFoundException(EErrorMessage.InviteNotFound);
  }

  async create(userId: string, projectId: string, input: InviteCreateInput): Promise<InviteEntity> {
    const user = await this.userService.findById(userId);
    const project = await this.projectService.getProject(userId, projectId);
    const alreadyInvitedUser = await this.inviteRepository.findOne({
      where: {
        project,
        invitedUserEmail: input.invitedUserEmail,
      },
    });

    if (alreadyInvitedUser) {
      throw new ConflictException(EErrorMessage.UserAlreadyInvited);
    }

    const result = await this.inviteRepository.insert({
      project,
      invitedByUser: user,
      invitedUserEmail: input.invitedUserEmail,
    });

    const createdInvite = await this.getInvite(user.id, result.identifiers[0].id);
    await this.pubSubService.pubSub.publish(EPubSubTriggers.InviteCreated, { invite: createdInvite });
    return createdInvite;
  }
}
