import { Args, Resolver, Query, Subscription } from '@nestjs/graphql';
import { TimelineService } from './timeline.service';
import { TimelineEntity } from './timeline.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from '../common/decorators/currentUser.decorator';
import { IAuthCurrentUserPayload } from '../auth/jwt.strategy';
import { EPubSubTriggers, PubSubService } from '../common/services/pubsub.service';

@Resolver(of => TimelineEntity)
export class TimelineResolvers {
  constructor(private readonly pubSubService: PubSubService, private readonly timelineService: TimelineService) {}

  @Query(returns => TimelineEntity)
  @UseGuards(GqlAuthGuard)
  async getTimeline(
    @CurrentUser() user: IAuthCurrentUserPayload,
    @Args('timelineId') timelineId: string,
  ): Promise<TimelineEntity> {
    return await this.timelineService.getTimeline(user.id, timelineId);
  }

  @Query(returns => [TimelineEntity])
  @UseGuards(GqlAuthGuard)
  async getTimelines(
    @CurrentUser() user: IAuthCurrentUserPayload,
    @Args('documentId') documentId: string,
  ): Promise<TimelineEntity[]> {
    return await this.timelineService.findTimelines(user.id, documentId);
  }

  @Subscription(returns => TimelineEntity)
  timelineCreated() {
    return this.pubSubService.pubSub.asyncIterator(EPubSubTriggers.TimelineCreated);
  }
}
