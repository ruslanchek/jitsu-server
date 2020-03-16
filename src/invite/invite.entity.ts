import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { ProjectEntity } from '../project/project.entity';

@Entity()
@ObjectType()
export class InviteEntity {
  @Field(type => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field(type => Boolean)
  @Column({ default: false })
  active: boolean;

  @Field(type => Date)
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  date: Date;

  @Field(type => UserEntity)
  @OneToOne(type => UserEntity)
  invitedByUser: UserEntity;

  @Field(type => UserEntity)
  @OneToOne(type => UserEntity)
  invitedUser: UserEntity;

  @Field(type => ProjectEntity)
  @OneToOne(type => ProjectEntity)
  project: ProjectEntity;

  @Field(type => String)
  @Column({ type: 'text', unique: true })
  invitedUserEmail: string;
}
