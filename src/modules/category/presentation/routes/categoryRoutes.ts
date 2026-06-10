import { Router, Request, Response } from 'express';
import { CategoryController } from '../controllers/CategoryController';
import { CategoryService } from '@/modules/category/application/services/CategoryService';
import { CategoryRepositoryImpl } from '@/modules/category/infrastructure/repositories/CategoryRepositoryImpl';
import CategorySequelizeModel from '@/modules/category/infrastructure/models/CategorySequelizeModel';
import { authMiddleware } from '@/modules/auth/presentation/middlewares/authMiddleware';

const categoryRepository = new CategoryRepositoryImpl(CategorySequelizeModel);
const categoryService = new CategoryService(categoryRepository);
const categoryController = new CategoryController(categoryService);

const router = Router();

router.post('/', authMiddleware, (req: Request, res: Response) => categoryController.create(req, res));
router.get('/', authMiddleware, (req: Request, res: Response) => categoryController.findAll(req, res));
router.get('/:id', authMiddleware, (req: Request, res: Response) => categoryController.findById(req, res));
router.patch('/:id', authMiddleware, (req: Request, res: Response) => categoryController.patch(req, res));
router.delete('/:id', authMiddleware, (req: Request, res: Response) => categoryController.delete(req, res));

export default router;
