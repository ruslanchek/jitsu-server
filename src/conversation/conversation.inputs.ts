import { InputType, Field, ID } from 'type-graphql';
import { MinLength } from 'class-validator';
import { EErrorMessage } from '../messages';
import { ConversationEntity } from './conversation.entity';

@InputType()
export class ConversationCreateInput implements Partial<ConversationEntity> {
  @Field(() => String)
  @MinLength(1, { message: EErrorMessage.ConversationTextMinLength })
  text: string;
}
