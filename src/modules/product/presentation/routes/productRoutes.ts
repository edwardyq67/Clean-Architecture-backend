import { Router, Request, Response } from 'express';
import { ProductController } from '../controllers/ProductController';
import { ProductService } from '@/modules/product/application/services/ProductService';
import { ProductRepositoryImpl } from '@/modules/product/infrastructure/repositories/ProductRepositoryImpl';
import ProductSequelizeModel from '@/modules/product/infrastructure/models/ProductSequelizeModel';
import { authMiddleware } from '@/modules/auth/presentation/middlewares/authMiddleware';
import { upload } from '@/middlewares/upload.middleware';
import { S3Service } from '@/shared/application/S3Service';

const productRepository = new ProductRepositoryImpl(ProductSequelizeModel);
const productService = new ProductService(productRepository);
const s3Service = new S3Service();
const productController = new ProductController(productService, s3Service);

const router = Router();

router.post('/', authMiddleware, upload.single('image'), (req: Request, res: Response) => productController.create(req, res));
router.get('/', authMiddleware, (req: Request, res: Response) => productController.findAll(req, res));
router.get('/:id', authMiddleware, (req: Request, res: Response) => productController.findById(req, res));
router.patch('/:id', authMiddleware, upload.single('image'), (req: Request, res: Response) => productController.patch(req, res));
router.delete('/:id', authMiddleware, (req: Request, res: Response) => productController.delete(req, res));

export default router;
