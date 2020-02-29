import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';
import { ProjectEntity } from '../project/project.entity';

@Entity()
@ObjectType()
export class UserEntity {
  @Field(type => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(type => String)
  @Column({ type: 'text', unique: true })
  email: string;

  @Column({ type: 'text', select: false })
  passwordHash: string;

  @Column({
    type: 'timestamp',
    select: false,
    default: 'now()',
    nullable: true,
  })
  passwordChangedDate: Date;

  @Column({
    type: 'timestamp',
    select: false,
    default: 'now()',
    nullable: true,
  })
  passwordResetCodeExpires: Date;

  @Column({
    type: 'timestamp',
    select: false,
    default: 'now()',
    nullable: true,
  })
  passwordResetInterval: Date;

  @Column({ type: 'text', select: false, nullable: true })
  passwordResetCode: string;

  @Column({ type: 'text', select: false, nullable: true })
  emailConfirmationCode: string;

  @Field(type => Boolean)
  @Column({ type: 'boolean', default: false })
  isEmailConfirmed: boolean;

  @Field(type => Date)
  @Column({
    type: 'timestamp',
    default: 'now()',
    nullable: true,
  })
  registeredDate: Date;

  @Field(type => [ProjectEntity])
  @OneToMany(
    type => ProjectEntity,
    project => project.user,
    { lazy: true },
  )
  projects: ProjectEntity[];

  @Field(type => [ProjectEntity])
  @ManyToMany(type => ProjectEntity, { lazy: true })
  @JoinTable()
  invitedToProjects: ProjectEntity[];
}
