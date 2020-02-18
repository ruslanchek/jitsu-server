import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user';
import { ENV } from '../env';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      synchronize: ENV.PG_SYNC,
      host: ENV.PG_HOST,
      port: ENV.PG_PORT,
      username: ENV.PG_USER,
      password: ENV.PG_PASS,
      database: ENV.PG_DB,
      entities: [User],
    }),
    GraphQLModule.forRoot({
      debug: false,
      playground: true,
      installSubscriptionHandlers: true,
      autoSchemaFile: '../schema.graphql',
    }),
    UserModule,
  ],
})
export class AppModule {}
