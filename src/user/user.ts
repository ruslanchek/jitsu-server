import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';
import { DateScalar } from '../common/scalars/date.scalar';

@Entity()
@ObjectType()
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field(() => String)
  @Column({ type: 'text', unique: true })
  email!: string;

  @Field(() => String)
  @Column({ type: 'text', select: false })
  passwordHash!: string;

  @Field(() => Date)
  @Column({
    type: 'timestamp',
    select: false,
    default: 'now()',
    nullable: true,
  })
  passwordChangedDate!: Date;

  @Field(() => Date)
  @Column({
    type: 'timestamp',
    select: false,
    default: 'now()',
    nullable: true,
  })
  passwordResetCodeExpires!: Date;

  @Field(() => Date)
  @Column({
    type: 'timestamp',
    select: false,
    default: 'now()',
    nullable: true,
  })
  passwordResetInterval!: Date;

  @Field(() => String)
  @Column({ type: 'text', select: false, nullable: true })
  passwordResetCode!: string;

  @Field(() => String)
  @Column({ type: 'text', select: false, nullable: true })
  emailConfirmationCode!: string;

  @Field(() => Boolean)
  @Column({ type: 'boolean', select: false, default: false })
  isEmailConfirmed!: boolean;
}