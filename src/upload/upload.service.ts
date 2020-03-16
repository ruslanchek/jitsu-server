import { Injectable } from '@nestjs/common';
import S3 from 'aws-sdk/clients/s3';
import { File } from '../common/scalars/upload.scalar';

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
    const result = s3.putObject(
      {
        Bucket: 'jitsu',
        Key: 'testobject1/ssss',
        Body: 'Hello from MinIO!!',
      },
      (err, data) => {
        console.log(err, data);
      },
    );
  }
}
