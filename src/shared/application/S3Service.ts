import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { s3Client, BUCKET_NAME } from '@/config/s3';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

export class S3Service {
    async uploadImage(file: Express.Multer.File): Promise<string> {
        const extension = path.extname(file.originalname);
        const key = `products/${uuidv4()}${extension}`;

        await s3Client.send(new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
        }));

        return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${key}`;
    }

    async deleteImage(imageUrl: string): Promise<void> {
        const url = new URL(imageUrl);
        const key = url.pathname.slice(1);

        await s3Client.send(new DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
        }));
    }
}
