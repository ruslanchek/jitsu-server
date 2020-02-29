import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';
import { ProjectEntity } from '../project/project.entity';
import { EDocumentPriority, EDocumentStatus, EDocumentType } from './document.scalars';

@Entity()
@ObjectType()
export class DocumentEntity {
  @Field(type => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field(type => String)
  @Column()
  name: string;

  @Field(type => ProjectEntity)
  @ManyToOne(
    type => ProjectEntity,
    project => project.documents,
    { lazy: true },
  )
  project: ProjectEntity;

  @Field(type => Date)
  @Column({
    type: 'timestamp',
    default: 'now()',
    nullable: true,
  })
  dueDate: Date;

  @Field(type => EDocumentType)
  @Column({ type: 'enum', enum: EDocumentType, default: EDocumentType.Document })
  type: EDocumentType;

  @Field(type => EDocumentPriority)
  @Column({ type: 'enum', enum: EDocumentPriority, default: EDocumentPriority.Default })
  priority: EDocumentPriority;

  @Field(type => EDocumentStatus)
  @Column({ type: 'enum', enum: EDocumentStatus, default: EDocumentStatus.Idle })
  status: EDocumentStatus;
}
