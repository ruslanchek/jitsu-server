import { InputType, Field, ID } from 'type-graphql';
import { MinLength, IsUUID, IsOptional } from 'class-validator';
import { EErrorMessage } from '../messages';
import { DocumentEntity } from './document.entity';

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

  @Field(() => Date, { nullable: true })
  @IsOptional()
  dueDate: Date;
}


@InputType()
export class DocumentGetByIdInput implements Partial<DocumentEntity> {
  @Field(() => ID)
  @IsUUID()
  id: string;
}
