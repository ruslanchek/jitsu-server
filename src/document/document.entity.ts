import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ProjectEntity } from '../project/project.entity';
import { EDocumentPriority, EDocumentStatus, EDocumentType } from './document.scalars';
import { UserEntity } from '../user/user.entity';
import GraphQLJSON from 'graphql-type-json';
import { ConversationEntity } from '../conversation/conversation.entity';
import { TimelineEntity } from '../timeline/timeline.entity';

@Entity()
@ObjectType()
export class DocumentEntity {
  @Field((type) => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field((type) => String)
  @Column()
  name: string;

  @ManyToOne((type) => ProjectEntity, (project) => project.documents)
  project: ProjectEntity;

  @Field((type) => Date)
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  dueDate: Date;

  @Field((type) => EDocumentType)
  @Column({ type: 'enum', enum: EDocumentType, default: EDocumentType.Document })
  type: EDocumentType;

  @Field((type) => EDocumentPriority)
  @Column({ type: 'enum', enum: EDocumentPriority, default: EDocumentPriority.Default })
  priority: EDocumentPriority;

  @Field((type) => EDocumentStatus)
  @Column({ type: 'enum', enum: EDocumentStatus, default: EDocumentStatus.Idle })
  status: EDocumentStatus;

  @Field((type) => GraphQLJSON)
  @Column({ type: 'json', default: [] })
  data: Object;

  @Field((type) => UserEntity)
  @ManyToOne((type) => UserEntity, (user) => user.documents, {eager: true})
  user: UserEntity;

  @OneToMany((type) => ConversationEntity, (conversation) => conversation.document)
  conversations: ConversationEntity[];

  @OneToMany((type) => TimelineEntity, (timeline) => timeline.document)
  timelines: TimelineEntity[];
}
