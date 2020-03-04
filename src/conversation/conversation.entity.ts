import { Column, Entity, JoinColumn, JoinTable, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';
import { DocumentEntity } from '../document/document.entity';
import { UserEntity } from '../user/user.entity';

@Entity()
@ObjectType()
export class ConversationEntity {
  @Field(type => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(type => String)
  @Column()
  text: string;

  @Field(type => DocumentEntity)
  @ManyToOne(
    type => DocumentEntity,
    document => document.conversations,
    { lazy: true },
  )
  @JoinTable()
  document: DocumentEntity;

  @Field(type => UserEntity)
  @ManyToOne(
    type => UserEntity,
    user => user.conversations,
    { lazy: true },
  )
  @JoinTable()
  user: UserEntity;
}
