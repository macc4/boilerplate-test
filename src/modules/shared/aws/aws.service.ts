import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3, config as AWSConfig } from 'aws-sdk';

@Injectable()
export class AWSService {
  private s3: S3;

  constructor(private readonly configService: ConfigService) {
    AWSConfig.update({
      region: this.configService.get<string>('AWS_REGION'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
    });

    this.s3 = new S3();
  }

  generatePresignedS3Link(fileName: string, bucketName: string): string {
    return this.s3.getSignedUrl('putObject', {
      Bucket: bucketName,
      Key: fileName,
      Expires: +this.configService.get<number>('AWS_PRESIGNED_URL_EXPIRY_TIME'),
    });
  }
}
