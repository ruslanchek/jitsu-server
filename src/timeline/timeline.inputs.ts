import { TimelineEntity } from './timeline.entity';

export class TimelineCreateInput implements Partial<TimelineEntity> {
  eventName: string;
  date: Date;
}
