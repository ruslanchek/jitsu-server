import { createConnection } from 'typeorm';
import { PROVIDER_NAMES } from '../constants';
import { UserEntity } from '../user/user.entity';

export const databaseProviders = [
  {
    provide: PROVIDER_NAMES.DATABASE_CONNECTION,
    useFactory: async () =>
      await createConnection({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'root',
        password: '123321',
        database: 'jitsu',
        synchronize: true,
        entities: [UserEntity],
      }),
  },
];
