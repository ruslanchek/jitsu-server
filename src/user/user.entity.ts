import { Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';

@Entity()
@ObjectType()
export class UserEntity {
  @Field(type => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
