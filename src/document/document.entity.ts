import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';
import { UserEntity } from '../user/user.entity';
import { ProjectEntity } from '../project/project.entity';

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
}
