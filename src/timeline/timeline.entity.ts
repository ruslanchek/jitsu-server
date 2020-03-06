import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';
import { DocumentEntity } from '../document/document.entity';
import { UserEntity } from '../user/user.entity';

@Entity()
@ObjectType()
export class TimelineEntity {
  @Field(type => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field(type => Date)
  @Column()
  date: Date;

  @Field(type => String)
  @Column()
  eventName: string;

  @ManyToOne(
    type => DocumentEntity,
    document => document.timelines,
  )
  document: DocumentEntity;

  @ManyToOne(
    type => UserEntity,
    user => user.timelines,
  )
  user: UserEntity;
}
