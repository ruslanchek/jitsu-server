import { Injectable } from '@nestjs/common';
import S3 from 'aws-sdk/clients/s3';
import { File } from '../common/scalars/upload.scalar';
import sharp from 'sharp';
import fileExtension from 'file-extension';
import { v1 as uuidv1 } from 'uuid';

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

  async uploadFile(file: File): Promise<void> {
    const s3 = this.getS3();
    const extension = fileExtension(file.filename);
    const filename = `uploads/${uuidv1()}.${extension}`;
    await s3.upload(
      {
        Bucket: 'jitsu',
        Key: filename,
        Body: file.createReadStream(),
        ContentEncoding: file.encoding,
        ContentType: file.mimetype,
      },
      (err, data) => {
        console.log(err, data);
      },
    );
  }
}
