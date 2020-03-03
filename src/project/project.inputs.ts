import { InputType, Field, ID } from 'type-graphql';
import { MinLength, IsUUID } from 'class-validator';
import { ProjectEntity } from './project.entity';
import { EErrorMessage } from '../messages';

@InputType()
export class ProjectCreateInput implements Partial<ProjectEntity> {
  @Field(() => String)
  @MinLength(3, { message: EErrorMessage.ProjectNameMinLength })
  name: string;
}

@InputType()
export class ProjectGetByIdInput implements Partial<ProjectEntity> {
  @Field(() => ID)
  @IsUUID()
  id: string;
}