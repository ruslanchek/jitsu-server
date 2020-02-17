import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'root',
      password: '123321',
      database: 'jitsu',
      synchronize: true,
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
