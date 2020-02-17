import { Connection } from 'typeorm';
import { UserEntity } from './user.entity';
import { PROVIDER_NAMES } from '../constants';

export const userProviders = [
  {
    provide: PROVIDER_NAMES.USER_REPOSITORY,
    useFactory: (connection: Connection) => connection.getRepository(UserEntity),
    inject: [PROVIDER_NAMES.DATABASE_CONNECTION],
  },
];
