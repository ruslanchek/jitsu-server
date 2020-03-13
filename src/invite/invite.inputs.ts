import { InputType, Field } from 'type-graphql';
import { IsEmail } from 'class-validator';
import { EErrorMessage } from '../messages';
import { InviteEntity } from './invite.entity';

@InputType()
export class InviteCreateInput implements Partial<InviteEntity> {
  @Field(() => String)
  @IsEmail({}, { message: EErrorMessage.IsEmail })
  invitedUserEmail: string;
}
