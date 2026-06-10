import { S3Client } from '@aws-sdk/client-s3';
import { env } from '@/config/env';

let s3Client: S3Client;
let bucketName: string;

export function getS3Client(): S3Client {
    if (!s3Client) {
        s3Client = new S3Client({
            region: env.AWS_REGION,
            credentials: {
                accessKeyId: env.AWS_ACCESS_KEY_ID,
                secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
            },
        });
    }
    return s3Client;
}

export function getBucketName(): string {
    if (!bucketName) {
        bucketName = env.AWS_BUCKET_NAME;
    }
    return bucketName;
}

export function getRegion(): string {
    return env.AWS_REGION;
}
