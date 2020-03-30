import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, JoinTable, ManyToOne } from "typeorm";
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

  @Field((type) => UserEntity)
  @OneToOne((type) => UserEntity)
  invitedByUser: UserEntity;

  @Field((type) => UserEntity)
  @OneToOne((type) => UserEntity)
  @JoinColumn()
  invitedUser: UserEntity;

  @Field((type) => ProjectEntity)
  @ManyToOne((type) => ProjectEntity, project => project.invites)
  project: ProjectEntity;

  @Field((type) => String)
  @Column({ type: 'text', unique: true })
  invitedUserEmail: string;

  @Column({ default: '', unique: true })
  code: string;
}
