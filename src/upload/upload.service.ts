import { Injectable } from '@nestjs/common';
import S3, { ManagedUpload } from 'aws-sdk/clients/s3';
import sharp from 'sharp';
import fileExtension from 'file-extension';
import { v1 as uuidv1 } from 'uuid';
import { ENV } from '../env';

export interface IFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

export interface IUploadOptions {
  uploadDir: EUploadDirectory;
  customFileName?: string;
}

export enum EUploadDirectory {
  ProjectAvatar = 'uploads/projects/avatars/',
}

@Injectable()
export class UploadService {
  private getS3() {
    return new S3({
      accessKeyId: ENV.S3_KEY,
      secretAccessKey: ENV.JWT_SECRET,
      endpoint: ENV.S3_ENDPOINT,
    });
  }

  async uploadFile(file: IFile, options: IUploadOptions): Promise<ManagedUpload.SendData> {
    const s3 = this.getS3();
    const { uploadDir, customFileName } = options;
    const extension = fileExtension(file.originalname);
    const filename = `${uploadDir}${customFileName ? customFileName : uuidv1()}.${extension}`;
    return new Promise((resolve, reject) => {
      s3.upload(
        {
          Bucket: ENV.S3_BUCKET,
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
