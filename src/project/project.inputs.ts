import { InputType, Field } from 'type-graphql';
import { MinLength, IsUrl } from 'class-validator';
import { ProjectEntity } from './project.entity';
import { EErrorMessage } from '../messages';

@InputType()
export class ProjectCreateInput implements Partial<ProjectEntity> {
  @Field(() => String)
  @MinLength(3, { message: EErrorMessage.ProjectNameMinLength })
  name: string;
}

@InputType()
export class ProjectChangeInput implements Partial<ProjectEntity> {
  @Field(() => String)
  @MinLength(3, { message: EErrorMessage.ProjectNameMinLength })
  name: string;

  @Field(() => String)
  @IsUrl(
    {
      require_protocol: true,
      require_host: true,
      require_valid_protocol: true,
    },
    { message: EErrorMessage.IsUrl },
  )
  avatar: string;
}
