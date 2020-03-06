import { Args, Resolver, Mutation, Query, Subscription } from '@nestjs/graphql';
import { TimelineService } from './timeline.service';
import { TimelineEntity } from './timeline.entity';
import { TimelineCreateInput } from './timeline.inputs';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from '../common/decorators/currentUser.decorator';
import { IAuthCurrentUserPayload } from '../auth/jwt.strategy';
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();

enum ETriggers {
  TimelineCreated = 'timelineCreated',
}

@Resolver(of => TimelineEntity)
export class TimelineResolvers {
  constructor(private readonly timelineService: TimelineService) {}

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

  @Mutation(returns => TimelineEntity)
  @UseGuards(GqlAuthGuard)
  async createTimeline(
    @CurrentUser() user: IAuthCurrentUserPayload,
    @Args('input') input: TimelineCreateInput,
    @Args('documentId') documentId: string,
  ): Promise<TimelineEntity> {
    const createdTimeline = await this.timelineService.create(user.id, documentId, input);
    await pubSub.publish(ETriggers.TimelineCreated, { timelineCreated: createdTimeline });
    return createdTimeline;
  }

  @Subscription(returns => TimelineEntity)
  timelineCreated() {
    return pubSub.asyncIterator(ETriggers.TimelineCreated);
  }
}
