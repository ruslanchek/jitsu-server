import { Injectable } from '@nestjs/common';
import S3, { ManagedUpload } from 'aws-sdk/clients/s3';
import sharp from 'sharp';
import fileExtension from 'file-extension';
import { v1 as uuidv1 } from 'uuid';

export interface IFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

export enum EUploadDirectory {
  ProjectAvatar = 'uploads/projects/avatars/',
}

@Injectable()
export class UploadService {
  private getS3() {
    return new S3({
      accessKeyId: '5QBMGAK5DZHDIBVU3WRK',
      secretAccessKey: '/84ibtGAuOhzPNXln+JxJLZxe6TvwGbPjnAEhpl0gmQ',
      endpoint: 'https://fra1.digitaloceanspaces.com',
    });
  }

  async uploadFile(file: IFile, uploadDir: EUploadDirectory, customFileName?: string): Promise<ManagedUpload.SendData> {
    const s3 = this.getS3();
    const extension = fileExtension(file.originalname);
    const filename = `${uploadDir}${customFileName ? customFileName : uuidv1()}.${extension}`;
    return new Promise((resolve, reject) => {
      s3.upload(
        {
          Bucket: 'jitsu',
          Key: filename,
          Body: file.buffer,
          ContentEncoding: file.encoding,
          ContentType: file.mimetype,
          ACL: 'public-read',
        },
        (err, data) => {
          if (err) {
            reject(err);
          }

          resolve(data);
        },
      );
    });
  }
}
