import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { ProjectEntity } from '../project/project.entity';

@Entity()
@ObjectType()
export class InviteEntity {
  @Field((type) => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field((type) => Boolean)
  @Column({ default: false })
  active: boolean;

  @Field((type) => Date)
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  date: Date;

  @Field((type) => String)
  @Column({ type: 'text' })
  invitedUserEmail: string;

  @Column({ default: '', unique: true })
  code: string;

  @Field((type) => UserEntity)
  @ManyToOne((type) => UserEntity, { eager: true })
  invitedByUser: UserEntity;

  @Field((type) => UserEntity)
  @ManyToOne((type) => UserEntity, { eager: true })
  invitedUser: UserEntity;

  @Field((type) => ProjectEntity)
  @ManyToOne((type) => ProjectEntity, (project) => project.invites, { eager: true })
  project: ProjectEntity;
}
