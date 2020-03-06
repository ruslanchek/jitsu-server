import { TimelineEntity } from './timeline.entity';
import { UserEntity } from '../user/user.entity';
import { DocumentEntity } from '../document/document.entity';

export class TimelineCreateInput implements Partial<TimelineEntity> {
  eventName: string;
  date: Date;
  user: UserEntity;
  document: DocumentEntity;
}
