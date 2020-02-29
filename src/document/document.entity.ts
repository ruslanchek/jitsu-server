import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';
import { ProjectEntity } from '../project/project.entity';
import { EDocumentType } from './document.scalars';

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

  @Field(type => EDocumentType)
  @Column({ type: 'enum', enum: EDocumentType, default: EDocumentType.Document })
  type: EDocumentType;
}
