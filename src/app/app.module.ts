import { ENV } from '../env';
import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { AuthModule } from '../auth/auth.module';
import { ProjectModule } from '../project/project.module';
import { ProjectEntity } from '../project/project.entity';
import { DocumentEntity } from '../document/document.entity';
import { DocumentModule } from '../document/document.module';
import { GraphQLJSON } from 'graphql-type-json';
import { ConversationModule } from '../conversation/conversation.module';
import { ConversationEntity } from '../conversation/conversation.entity';

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
      entities: [UserEntity, ProjectEntity, DocumentEntity, ConversationEntity],
    }),
    GraphQLModule.forRoot({
      debug: false,
      playground: true,
      installSubscriptionHandlers: true,
      resolvers: { JSON: GraphQLJSON },
      autoSchemaFile: 'schema.graphql',
      context: ({ req, connection }) => (connection ? { req: { headers: connection.context } } : { req }),
    }),
    AuthModule,
    UserModule,
    ProjectModule,
    DocumentModule,
    ConversationModule,
  ],
})
export class AppModule {}
