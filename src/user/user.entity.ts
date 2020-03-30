import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ProjectEntity } from '../project/project.entity';
import { ConversationEntity } from '../conversation/conversation.entity';
import { TimelineEntity } from '../timeline/timeline.entity';
import { AdminEntity } from 'nestjs-admin';
import { DocumentEntity } from '../document/document.entity';

export class UserEntityAdmin extends AdminEntity {
  entity = UserEntity;
  listDisplay = ['id', 'email', 'nickname'];
  searchFields = ['id', 'email', 'nickname'];
}

@Entity()
@ObjectType()
export class UserEntity {
  @Field((type) => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field((type) => String)
  @Column({ type: 'text', unique: true })
  email: string;

  @Field((type) => String)
  @Column({
    type: 'text',
    unique: true,
  })
  nickname: string;

  @Column({ type: 'text', select: false })
  passwordHash: string;

  @Column({
    type: 'timestamp',
    select: false,
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  passwordChangedDate: Date;

  @Column({
    type: 'timestamp',
    select: false,
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  passwordResetCodeExpires: Date;

  @Column({
    type: 'timestamp',
    select: false,
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  passwordResetInterval: Date;

  @Column({ type: 'text', select: false, nullable: true })
  passwordResetCode: string;

  @Column({ type: 'text', select: false, nullable: true })
  emailConfirmationCode: string;

  @Field((type) => Boolean)
  @Column({ type: 'boolean', default: false })
  isEmailConfirmed: boolean;

  @Field((type) => Date)
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  registeredDate: Date;

  @OneToMany((type) => DocumentEntity, (document) => document.user, { lazy: true })
  documents: Promise<DocumentEntity[]>;

  @OneToMany((type) => ProjectEntity, (project) => project.user, { lazy: true })
  projects: Promise<ProjectEntity[]>;

  @ManyToMany((type) => ProjectEntity, { lazy: true })
  invitedToProjects: Promise<ProjectEntity[]>;

  @OneToMany((type) => ConversationEntity, (conversation) => conversation.user, { lazy: true })
  conversations: Promise<ConversationEntity[]>;

  @OneToMany((type) => TimelineEntity, (timeline) => timeline.user, { lazy: true })
  timelines: Promise<TimelineEntity[]>;
}
