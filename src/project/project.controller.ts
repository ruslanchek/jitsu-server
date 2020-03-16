import { Controller, Param, Patch, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../common/decorators/currentUser.decorator';
import { ProjectService } from './project.service';
import { IFile } from '../upload/upload.service';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Patch('/upload-avatar/:projectId')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard('jwt'))
  async uploadAvatar(@UploadedFile() file: IFile, @CurrentUser() user, @Param('projectId') projectId: string) {
    return await this.projectService.uploadAvatar(user.id, projectId, file);
  }
}
