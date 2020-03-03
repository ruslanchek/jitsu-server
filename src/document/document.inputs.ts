import { InputType, Field, ID } from 'type-graphql';
import { MinLength, IsUUID } from 'class-validator';
import { EErrorMessage } from '../messages';
import { DocumentEntity } from './document.entity';
import { Optional } from '@nestjs/common';

@InputType()
export class DocumentCreateInput implements Partial<DocumentEntity> {
  @Field(() => String)
  @MinLength(3, { message: EErrorMessage.DocumentNameMinLength })
  name: string;
}

@InputType()
export class DocumentChangeInput implements Partial<DocumentEntity> {
  @Field(() => String, { nullable: true })
  @Optional()
  @MinLength(3, { message: EErrorMessage.DocumentNameMinLength })
  name: string;
}


@InputType()
export class DocumentGetByIdInput implements Partial<DocumentEntity> {
  @Field(() => ID)
  @IsUUID()
  id: string;
}

@InputType()
export class DocumentProjectIdInput {
  @Field(() => ID)
  @IsUUID()
  projectId: string;
}
