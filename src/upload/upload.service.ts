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
      accessKeyId: 'minioadmin',
      secretAccessKey: 'minioadmin',
      endpoint: 'http://127.0.0.1:9000',
      s3ForcePathStyle: true,
      signatureVersion: 'v4',
    });
  }

  async uploadFile(file: IFile, uploadDir: EUploadDirectory): Promise<ManagedUpload.SendData> {
    const s3 = this.getS3();
    const extension = fileExtension(file.originalname);
    const filename = `${uploadDir}${uuidv1()}.${extension}`;

    return new Promise((resolve, reject) => {
      s3.upload(
        {
          Bucket: 'jitsu',
          Key: filename,
          Body: file.buffer,
          ContentEncoding: file.encoding,
          ContentType: file.mimetype,
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
