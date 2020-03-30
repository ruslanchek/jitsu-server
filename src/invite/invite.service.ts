import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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
import { EMAIL_DATA } from '../constants';
import { UnauthorizedError } from 'type-graphql';

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
    return encodeURIComponent(bcrypt.hashSync(`${string}${Date.now()}`, bcrypt.genSaltSync(10)));
  }

  async sendInvite(email: string, user: UserEntity, code: string) {
    await this.emailService.sendInvite(email, {
      name: email,
      inviteSenderName: user.email,
      inviteSenderOrganizationName: 'ORG',
      actionUrl: `${EMAIL_DATA.INVITE_LINK}${code}`,
    });
  }

  async getInviteByCode(
    code: string,
    select?: Array<keyof InviteEntity>,
    relations?: Array<keyof InviteEntity>,
  ): Promise<InviteEntity> {
    return await this.inviteRepository.findOne({
      where: {
        code,
      },
      relations,
      select,
    });
  }

  async getInvite(
    userId: string,
    inviteId: string,
    select?: Array<keyof InviteEntity>,
    relations?: Array<keyof InviteEntity>,
  ): Promise<InviteEntity> {
    const invitedByUser = await this.userService.findById(userId);
    const invite = await this.inviteRepository.findOne({
      where: {
        id: inviteId,
        invitedByUser,
      },
      relations,
      select,
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
      relations: ['project'],
      where: {
        project,
        user,
      },
    });
  }

  async create(userId: string, projectId: string, input: InviteCreateInput): Promise<InviteEntity> {
    const invitedByUser = await this.userService.findById(userId);

    if (!invitedByUser) {
      throw new UnauthorizedError();
    }

    if (invitedByUser.email === input.invitedUserEmail) {
      throw new ConflictException(EErrorMessage.SelfInvited);
    }

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
      invitedByUser,
      invitedUserEmail: input.invitedUserEmail,
      code,
    });

    const inviteCreated = await this.getInvite(invitedByUser.id, result.identifiers[0].id);
    await this.sendInvite(input.invitedUserEmail, invitedByUser, code);
    await this.pubSubService.pubSub.publish(EPubSubTriggers.InviteCreated, { inviteCreated });
    return inviteCreated;
  }

  async resend(userId: string, inviteId: string): Promise<InviteEntity> {
    const invitedByUser = await this.userService.findById(userId);

    if (!invitedByUser) {
      throw new UnauthorizedError();
    }

    const invite = await this.getInvite(userId, inviteId, ['id', 'active', 'date', 'code', 'invitedUserEmail']);

    if (invite.active) {
      throw new BadRequestException(EErrorMessage.InviteAlreadyAccepted);
    }

    await this.sendInvite(invite.invitedUserEmail, invitedByUser, invite.code);
    return invite;
  }

  async accept(userId: string, inviteCode: string): Promise<InviteEntity> {
    const user = await this.userService.findById(userId, ['id', 'email']);
    const invite = await this.getInviteByCode(inviteCode, ['id', 'invitedUserEmail', 'active']);

    if (!user || !invite || invite.invitedUserEmail !== user.email) {
      throw new NotFoundException(EErrorMessage.InviteNotFound);
    }

    if (invite.active) {
      throw new NotFoundException(EErrorMessage.InviteAlreadyAccepted);
    }

    invite.active = true;
    invite.invitedUser = user;

    await this.inviteRepository.save(invite);
    return await this.getInviteByCode(inviteCode, ['id', 'active', 'date', 'invitedUserEmail']);
  }
}
