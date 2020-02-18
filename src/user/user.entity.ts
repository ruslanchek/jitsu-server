import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';

@Entity()
@ObjectType()
export class UserEntity {
  @Field(type => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field(type => String)
  @Column({ type: 'text', unique: true })
  email!: string;

  @Column({ type: 'text', select: false })
  passwordHash!: string;

  @Column({
    type: 'timestamp',
    select: false,
    default: 'now()',
    nullable: true,
  })
  passwordChangedDate!: Date;

  @Column({
    type: 'timestamp',
    select: false,
    default: 'now()',
    nullable: true,
  })
  passwordResetCodeExpires!: Date;

  @Column({
    type: 'timestamp',
    select: false,
    default: 'now()',
    nullable: true,
  })
  passwordResetInterval!: Date;

  @Column({ type: 'text', select: false, nullable: true })
  passwordResetCode!: string;

  @Column({ type: 'text', select: false, nullable: true })
  emailConfirmationCode!: string;

  @Field(type => Boolean)
  @Column({ type: 'boolean', select: false, default: false })
  isEmailConfirmed!: boolean;

  @Field(type => Date)
  @Column({
    type: 'timestamp',
    select: false,
    default: 'now()',
    nullable: true,
  })
  registeredDate!: Date;
}
