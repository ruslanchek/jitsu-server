import { Field, ID, ObjectType } from 'type-graphql';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { UserEntity } from '../user/user.entity';

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
  invitedBy: UserEntity;

  @Field(type => String)
  @Column({ type: 'text', unique: true })
  invitedUserEmail: string;
}
