import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3, config as AWSConfig } from 'aws-sdk';

interface AWSServiceConfig {
  imagesBucketName: string;
}

@Injectable()
export class AWSService {
  private s3: S3;
  private readonly config: AWSServiceConfig;

  constructor(private readonly configService: ConfigService) {
    AWSConfig.update({
      region: this.configService.get<string>('AWS_REGION'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
    });

    this.s3 = new S3();

    this.config = {
      imagesBucketName: this.configService.get('AWS_IMAGES_BUCKET_NAME'),
    };
  }

  async uploadImage(buffer: Buffer, originalname: string): Promise<string> {
    return this.uploadFile(this.config.imagesBucketName, buffer, originalname);
  }

  async uploadFile(
    bucket: string,
    buffer: Buffer,
    originalname: string,
  ): Promise<string> {
    const s3 = new S3();

    const upload = await s3
      .upload({
        Bucket: bucket,
        Body: buffer,
        Key: originalname,
      })
      .promise();

    return upload.Location;
  }
}
