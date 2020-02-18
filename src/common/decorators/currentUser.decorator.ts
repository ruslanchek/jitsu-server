import { createParamDecorator } from '@nestjs/common';
import { IAuthCurrentUserPayload } from '../../auth/jwt.strategy';

export const CurrentUser = createParamDecorator(
  (data, [root, args, ctx, info]): IAuthCurrentUserPayload => {
    return ctx.req.user;
  },
);
