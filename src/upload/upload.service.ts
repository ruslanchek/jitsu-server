import { Injectable } from '@nestjs/common';
import S3, { ManagedUpload } from 'aws-sdk/clients/s3';
import sharp from 'sharp';
import { v1 as uuidv1 } from 'uuid';
import { ENV } from '../env';

export interface IUploadResult {
  format: string;
  url: string;
}

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
  size: {
    width: number;
    height: number;
  };
}

export enum EUploadDirectory {
  ProjectAvatar = 'uploads/projects/avatars/',
}

@Injectable()
export class UploadService {
  private getS3() {
    return new S3({
      accessKeyId: ENV.S3_KEY,
      secretAccessKey: ENV.S3_SECRET,
      endpoint: ENV.S3_ENDPOINT,
    });
  }

  async upload(buffer: Buffer, path: string, mimetype: string, encoding: string = ''): Promise<ManagedUpload.SendData> {
    const s3 = this.getS3();
    return new Promise(async (resolve, reject) => {
      s3.upload(
        {
          Bucket: ENV.S3_BUCKET,
          Key: path,
          Body: buffer,
          ContentEncoding: encoding,
          ContentType: mimetype,
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

  async uploadImage(file: Buffer, options: IUploadOptions): Promise<IUploadResult[]> {
    const { uploadDir, customFileName, size } = options;
    const filename = `${uploadDir}${customFileName ? customFileName : uuidv1()}`;
    const sharped = await sharp(file).resize(size.width, size.height);
    const jpeg = await sharped.jpeg({
      quality: 95,
    });
    const webp = await sharped.webp();
    return [
      {
        format: 'jpeg',
        url: (await this.upload(await jpeg.toBuffer(), `${filename}.jpeg`, 'image/jpeg')).Location,
      },
      {
        format: 'webp',
        url: (await this.upload(await webp.toBuffer(), `${filename}.webp`, 'image/webp')).Location,
      },
    ];
  }
}
