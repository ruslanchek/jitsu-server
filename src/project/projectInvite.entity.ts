import { Field, ID, ObjectType } from 'type-graphql';
import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class ProjectInviteEntity {
  @Field(type => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;
}
