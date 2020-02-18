import { BadRequestException, ExecutionContext, Injectable } from '@nestjs/common';
import { EErrorMessage } from '../messages';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    let { req } = ctx.getContext();

    //Subscription requests don't have context, so check the token for header
    if (typeof req === 'undefined') {
      const token = context.switchToWs().getData().token;

      if (!token) {
        throw new BadRequestException(EErrorMessage.InvalidToken);
      }

      //build request context so that it can be read by super.canActivate
      const authHeader = {
        authorization: token,
      };

      req = { headers: authHeader };
    }

    return super.canActivate(new ExecutionContextHost([req]));
  }
}