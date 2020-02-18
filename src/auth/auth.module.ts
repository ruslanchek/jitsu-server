import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ENV } from '../env';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: ENV.JWT_SECRET,
      signOptions: { expiresIn: `${ENV.JWT_EXPIRES_SECONDS}s` },
    }),
  ],
  providers: [JwtStrategy],
})
export class AuthModule {}