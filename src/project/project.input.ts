import { InputType, Field } from 'type-graphql';
import { MinLength } from 'class-validator';
import { ProjectEntity } from './project.entity';
import { EErrorMessage } from '../messages';

@InputType()
export class ProjectCreateInput implements Partial<ProjectEntity> {
  @Field(() => String)
  @MinLength(3, { message: EErrorMessage.ProjectNameMinLength })
  name: string;
}
