import { ENV } from '../env';
import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { AuthModule } from '../auth/auth.module';
import { ProjectModule } from '../project/project.module';
import { ProjectEntity } from '../project/project.entity';

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
      entities: [UserEntity, ProjectEntity],
    }),
    GraphQLModule.forRoot({
      debug: false,
      playground: true,
      installSubscriptionHandlers: true,
      autoSchemaFile: 'schema.graphql',
      context: ({ req, connection }) => (connection ? { req: { headers: connection.context } } : { req }),
    }),
    AuthModule,
    UserModule,
    ProjectModule,
  ],
})
export class AppModule {}
