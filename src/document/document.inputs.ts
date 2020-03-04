import { InputType, Field, ID } from 'type-graphql';
import { MinLength, IsUUID, IsOptional } from 'class-validator';
import { EErrorMessage } from '../messages';
import { DocumentEntity } from './document.entity';
import { EDocumentPriority, EDocumentStatus } from './document.scalars';
import GraphQLJSON, { GraphQLJSONObject } from 'graphql-type-json';

@InputType()
export class DocumentCreateInput implements Partial<DocumentEntity> {
  @Field(() => String)
  @MinLength(3, { message: EErrorMessage.DocumentNameMinLength })
  name: string;
}

@InputType()
export class DocumentChangeInput implements Partial<DocumentEntity> {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @MinLength(3, { message: EErrorMessage.DocumentNameMinLength })
  name: string;

  @Field(() => Date )
  @IsOptional()
  dueDate: Date;

  @Field(() => EDocumentPriority, { nullable: true })
  @IsOptional()
  priority: EDocumentPriority;

  @Field(() => EDocumentStatus, { nullable: true })
  @IsOptional()
  status: EDocumentStatus;

  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()
  data: Object;
}


@InputType()
export class DocumentGetByIdInput implements Partial<DocumentEntity> {
  @Field(() => ID)
  @IsUUID()
  id: string;
}
