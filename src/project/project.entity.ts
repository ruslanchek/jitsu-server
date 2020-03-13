import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';
import { UserEntity } from '../user/user.entity';
import { DocumentEntity } from '../document/document.entity';

@Entity()
@ObjectType()
export class ProjectEntity {
  @Field(type => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

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
