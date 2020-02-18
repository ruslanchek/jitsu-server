import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectEntity } from './project.entity';
import { ProjectResolvers } from './project.resolvers';
import { DateScalar } from '../common/scalars/date.scalar';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEntity])],
  providers: [ProjectService, ProjectResolvers, DateScalar],
  exports: [ProjectService],
})
export class ProjectModule {}
