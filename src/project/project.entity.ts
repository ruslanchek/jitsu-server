import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';

@Entity()
@ObjectType()
export class ProjectEntity {
  @Field(type => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field(type => String)
  @Column()
  name: string;
}
