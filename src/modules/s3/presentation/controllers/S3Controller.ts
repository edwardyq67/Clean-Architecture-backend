import { Request, Response } from 'express';
import { S3Service } from '@/modules/s3/application/services/S3Service';

export class S3Controller {
    constructor(private readonly s3Service: S3Service) {}

    async uploadImage(req: Request, res: Response): Promise<void> {
        try {
            const file = req.file;
            if (!file) {
                res.status(400).json({ error: 'No se proporcionó ningún archivo' });
                return;
            }

            const folder = (req.body.folder as string) || 'uploads';
            const url = await this.s3Service.uploadImage(file, folder);

            res.status(201).json({
                url,
                key: url.split('/').slice(3).join('/'),
                originalName: file.originalname,
                mimeType: file.mimetype,
                size: file.size,
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message || 'Error al subir archivo' });
        }
    }

    async deleteImage(req: Request, res: Response): Promise<void> {
        try {
            const { url } = req.body;
            if (!url) {
                res.status(400).json({ error: 'URL del archivo es requerida' });
                return;
            }

            await this.s3Service.deleteImage(url);
            res.status(204).send();
        } catch (error: any) {
            res.status(500).json({ error: error.message || 'Error al eliminar archivo' });
        }
    }
}
