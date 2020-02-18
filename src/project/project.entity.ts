import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';
import { UserEntity } from '../user/user.entity';

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
    { lazy: true },
  )
  user: UserEntity;

  @Field(type => [UserEntity])
  @ManyToMany(type => UserEntity, { lazy: true })
  @JoinTable()
  invitedUsers: UserEntity[];
}
