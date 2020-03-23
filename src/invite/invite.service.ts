import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { InviteEntity } from './invite.entity';
import { ProjectService } from '../project/project.service';
import { EPubSubTriggers, PubSubService } from '../common/services/pubsub.service';
import { Repository } from 'typeorm';
import { InviteCreateInput } from './invite.inputs';
import { EErrorMessage } from '../messages';
import { EmailService } from '../email/email.service';
import { UserEntity } from '../user/user.entity';
import bcrypt from 'bcrypt';

@Injectable()
export class InviteService {
  constructor(
    @InjectRepository(InviteEntity)
    private readonly inviteRepository: Repository<InviteEntity>,
    private readonly userService: UserService,
    private readonly projectService: ProjectService,
    private readonly pubSubService: PubSubService,
    private readonly emailService: EmailService,
  ) {}

  private generateCodeHash(string: string): string {
    return bcrypt.hashSync(`${string}${Date.now()}`, bcrypt.genSaltSync(10));
  }

  async sendInvite(email: string, user: UserEntity, code: string) {
    await this.emailService.sendInvite(email, {
      name: email,
      inviteSenderName: user.nickname,
      inviteSenderOrganizationName: 'ORG',
      actionUrl: `https://app.jitsu.works/invited?code=${code}`,
    });
  }

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

  async findInvites(userId: string, projectId: string): Promise<InviteEntity[]> {
    const user = await this.userService.findById(userId);
    const project = await this.projectService.getProject(user.id, projectId);
    return await this.inviteRepository.find({
      where: {
        project,
        user,
      },
    });
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

    const code = this.generateCodeHash(`${userId}${projectId}${input.invitedUserEmail}`);
    const result = await this.inviteRepository.insert({
      project,
      invitedByUser: user,
      invitedUserEmail: input.invitedUserEmail,
      code,
    });

    const inviteCreated = await this.getInvite(user.id, result.identifiers[0].id);
    await this.sendInvite(input.invitedUserEmail, user, code);
    await this.pubSubService.pubSub.publish(EPubSubTriggers.InviteCreated, { inviteCreated });
    return inviteCreated;
  }

  async resend(userId: string, inviteId: string): Promise<InviteEntity> {
    const invite = await this.getInvite(userId, inviteId);
    await this.sendInvite(invite.invitedUserEmail, invite.invitedByUser, invite.code);
    return invite;
  }
}
