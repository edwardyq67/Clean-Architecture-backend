import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getS3Client, getBucketName, getRegion } from '@/modules/s3/infrastructure/S3ClientFactory';
import { S3Url } from '@/modules/s3/domain/value-objects/S3Url';
import { S3Key } from '@/modules/s3/domain/value-objects/S3Key';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

export class S3Service {
    async uploadImage(file: Express.Multer.File, folder: string = 'products'): Promise<string> {
        const extension = path.extname(file.originalname);
        const key = `${folder}/${uuidv4()}${extension}`;

        await getS3Client().send(new PutObjectCommand({
            Bucket: getBucketName(),
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
        }));

        return S3Url.build(getBucketName(), getRegion(), key).toString();
    }

    async uploadFile(file: Express.Multer.File, folder: string = 'uploads'): Promise<S3Url> {
        const extension = path.extname(file.originalname);
        const key = `${folder}/${uuidv4()}${extension}`;

        await getS3Client().send(new PutObjectCommand({
            Bucket: getBucketName(),
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
        }));

        return S3Url.build(getBucketName(), getRegion(), key);
    }

    async deleteImage(imageUrl: string): Promise<void> {
        const key = S3Key.fromUrl(imageUrl);

        await getS3Client().send(new DeleteObjectCommand({
            Bucket: getBucketName(),
            Key: key.toString(),
        }));
    }

    async deleteFile(s3Url: S3Url): Promise<void> {
        await getS3Client().send(new DeleteObjectCommand({
            Bucket: getBucketName(),
            Key: s3Url.key,
        }));
    }
}
