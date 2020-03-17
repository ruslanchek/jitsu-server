import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UserEntity } from '../user/user.entity';
import { DocumentEntity } from '../document/document.entity';
import GraphQLJSON from 'graphql-type-json';
import { IUploadResult } from '../upload/upload.service';

@Entity()
@ObjectType()
export class ProjectEntity {
  @Field(type => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field(type => GraphQLJSON)
  @Column({ type: 'json', default: [] })
  avatar: IUploadResult[];

  @Field(type => String)
  @Column()
  name: string;

  @Field(type => UserEntity)
  @ManyToOne(
    type => UserEntity,
    user => user.projects,
  )
  user: UserEntity;

  @OneToMany(
    type => DocumentEntity,
    document => document.project,
  )
  documents: DocumentEntity[];
}
