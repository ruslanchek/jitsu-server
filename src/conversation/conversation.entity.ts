import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { DocumentEntity } from '../document/document.entity';
import { UserEntity } from '../user/user.entity';

@Entity()
@ObjectType()
export class ConversationEntity {
  @Field((type) => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field((type) => String)
  @Column()
  text: string;

  @Field((type) => Date)
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  date: Date;

  @ManyToOne((type) => DocumentEntity, (document) => document.conversations, { lazy: true })
  document: DocumentEntity;

  @Field((type) => UserEntity)
  @ManyToOne((type) => UserEntity, (user) => user.conversations, { lazy: true })
  user: UserEntity;
}
