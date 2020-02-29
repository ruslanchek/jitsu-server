import { InputType, Field, ID } from 'type-graphql';
import { MinLength, IsUUID, IsDefined } from 'class-validator';
import { EErrorMessage } from '../messages';
import { DocumentEntity } from './document.entity';

@InputType()
export class DocumentCreateInput implements Partial<DocumentEntity> {
  @Field(() => String)
  @MinLength(3, { message: EErrorMessage.DocumentNameMinLength })
  name: string;

  @Field(() => ID)
  @IsUUID()
  projectId: string;
}

@InputType()
export class DocumentGetByIdInput implements Partial<DocumentEntity> {
  @Field(() => ID)
  @IsUUID()
  id: string;
}
