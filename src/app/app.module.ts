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
import { TimelineModule } from '../timeline/timeline.module';
import { TimelineEntity } from '../timeline/timeline.entity';
import { InviteEntity } from '../invite/invite.entity';
import { InviteModule } from '../invite/invite.module';
import { UploadScalar } from '../common/scalars/upload.scalar';
import { DateScalar } from '../common/scalars/date.scalar';
import { UploadModule } from '../upload/upload.module';

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
      entities: [
        UserEntity,
        ProjectEntity,
        InviteEntity,
        DocumentEntity,
        ConversationEntity,
        TimelineEntity,
        InviteEntity,
      ],
    }),
    GraphQLModule.forRoot({
      debug: false,
      playground: true,
      installSubscriptionHandlers: true,
      resolvers: { JSON: GraphQLJSON },
      autoSchemaFile: 'schema.graphql',
      uploads: true,
      context: ({ req }) => req,
    }),
    AuthModule,
    UserModule,
    ProjectModule,
    DocumentModule,
    ConversationModule,
    TimelineModule,
    InviteModule,
    UploadModule,
  ],
  providers: [UploadScalar, DateScalar],
})
export class AppModule {}
