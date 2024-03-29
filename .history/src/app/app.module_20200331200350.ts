import { ENV } from '../env';
import { Module, UnauthorizedException } from '@nestjs/common';
import { DefaultAdminModule } from 'nestjs-admin';
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
import { DateScalar } from '../common/scalars/date.scalar';
import { UploadModule } from '../upload/upload.module';
import { AvatarModule } from '../avatar/avatar.module';
import { EmailModule } from '../email/email.module';
import { AppController } from './app.controller';
import { ExtractJwt } from 'passport-jwt';
import { EErrorMessage, errorMessages } from '../messages';

const AdminUser = require('nestjs-admin').AdminUserEntity;

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
        AdminUser,
      ],
    }),
    GraphQLModule.forRoot({
      debug: false,
      playground: true,
      installSubscriptionHandlers: true,
      resolvers: { JSON: GraphQLJSON },
      autoSchemaFile: 'schema.graphql',
      formatError: (error) => {
        let fields = [];

        try {
          let additionalErrorMessage = error?.extensions?.exception?.message;

          if (error?.extensions?.exception?.response?.message) {
            if (typeof error?.extensions?.exception?.response?.message === 'string') {
              additionalErrorMessage = String(fields).toUpperCase();
            } else {
              fields = error?.extensions?.exception?.response?.message;
            }
          }

          switch (additionalErrorMessage) {
            case 'Bad Request Exception': {
              additionalErrorMessage = EErrorMessage.BadRequest;
              break;
            }
          }

          let message = additionalErrorMessage || (error.message.toUpperCase() as EErrorMessage);

          if (!errorMessages.includes(message)) {
            message = EErrorMessage.UnknownError;
          }

          return {
            fields,
            message,
            path: error.path,
          };
        } catch (e) {
          return {
            fields,
            message: EErrorMessage.ServerError,
            path: error?.path || [],
          };
        }
      },
      context: ({ req }) => req,
    }),
    DefaultAdminModule,
    AuthModule,
    UserModule,
    ProjectModule,
    DocumentModule,
    ConversationModule,
    TimelineModule,
    InviteModule,
    UploadModule,
    AvatarModule,
    EmailModule,
  ],
  providers: [DateScalar],
  controllers: [AppController],
})
export class AppModule {}
