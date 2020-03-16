import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IAuthCurrentUserPayload } from '../../auth/jwt.strategy';
import { IncomingMessage } from 'http';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): IAuthCurrentUserPayload => {
    const args = ctx.getArgs();
    return args.find(arg => arg instanceof IncomingMessage).user;
  },
);
