import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ENV } from '../env';

interface IJwtPayload {
  id: string; // User id
  iat: number; // Date created
  exp: number; // Date expire
}

export interface IAuthCurrentUserPayload {
  id: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: ENV.JWT_SECRET,
    });
  }

  async validate(payload: IJwtPayload): Promise<IAuthCurrentUserPayload> {
    return {
      id: payload.id,
    };
  }
}
