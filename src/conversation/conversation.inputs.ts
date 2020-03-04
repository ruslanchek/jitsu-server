import { InputType, Field, ID } from 'type-graphql';
import { IsUUID, MinLength } from 'class-validator';
import { EErrorMessage } from '../messages';
import { ConversationEntity } from './conversation.entity';

@InputType()
export class ConversationCreateInput implements Partial<ConversationEntity> {
  @Field(() => String)
  @MinLength(3, { message: EErrorMessage.DocumentNameMinLength })
  text: string;
}

@InputType()
export class ConversationGetByIdInput implements Partial<ConversationEntity> {
  @Field(() => ID)
  @IsUUID()
  id: string;
}
