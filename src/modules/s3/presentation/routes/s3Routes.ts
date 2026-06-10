import { Router, Request, Response } from 'express';
import { S3Controller } from '../controllers/S3Controller';
import { S3Service } from '../../application/services/S3Service';
import { authMiddleware } from '@/modules/auth/presentation/middlewares/authMiddleware';
import { upload } from '@/middlewares/upload.middleware';

const s3Service = new S3Service();
const s3Controller = new S3Controller(s3Service);

const router = Router();

router.post('/upload', authMiddleware, upload.single('file'), (req: Request, res: Response) => s3Controller.uploadImage(req, res));
router.delete('/delete', authMiddleware, (req: Request, res: Response) => s3Controller.deleteImage(req, res));

export default router;
