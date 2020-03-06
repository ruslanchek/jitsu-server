import { InputType, Field } from 'type-graphql';
import { IsDefined } from 'class-validator';
import { TimelineEntity } from './timeline.entity';

@InputType()
export class TimelineCreateInput implements Partial<TimelineEntity> {
  @Field(() => String)
  @IsDefined()
  eventName: string;
}
