import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DateScalar } from '../common/scalars/date.scalar';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/user.entity';
import { DocumentEntity } from './document.entity';
import { DocumentService } from './document.service';
import { DocumentResolvers } from './document.resolvers';
import { ProjectService } from '../project/project.service';
import { ProjectEntity } from '../project/project.entity';
import { DocumentPriorityScalar, DocumentStatusScalar, DocumentTypeScalar } from './document.scalars';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentEntity, DocumentEntity, UserEntity, ProjectEntity])],
  providers: [
    DocumentService,
    DocumentResolvers,
    DateScalar,
    DocumentTypeScalar,
    DocumentPriorityScalar,
    DocumentStatusScalar,
    UserService,
    ProjectService,
  ],
  exports: [DocumentService],
})
export class DocumentModule {}
