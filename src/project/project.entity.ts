import { AfterLoad, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UserEntity } from '../user/user.entity';
import { DocumentEntity } from '../document/document.entity';
import GraphQLJSON from 'graphql-type-json';
import { IUploadResult } from '../upload/upload.service';
import { AdminEntity } from 'nestjs-admin';
import { InviteEntity } from '../invite/invite.entity';

export class ProjectEntityAdmin extends AdminEntity {
  entity = ProjectEntity;
  listDisplay = ['id', 'name'];
  searchFields = ['id', 'name'];
}

@Entity()
@ObjectType()
export class ProjectEntity {
  @Field((type) => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field((type) => GraphQLJSON)
  @Column({ type: 'json', default: [] })
  avatar: IUploadResult[];

  @Field((type) => String)
  @Column()
  name: string;

  @Field((type) => UserEntity)
  @ManyToOne((type) => UserEntity, (user) => user.projects, { lazy: true })
  user: Promise<UserEntity>;

  @OneToMany((type) => InviteEntity, (invite) => invite.project, { lazy: true })
  invites: Promise<InviteEntity[]>;

  @OneToMany((type) => DocumentEntity, (document) => document.project, { lazy: true })
  documents: Promise<DocumentEntity[]>;
}
