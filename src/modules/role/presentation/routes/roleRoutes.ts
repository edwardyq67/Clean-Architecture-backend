import { Router, Request, Response } from 'express';
import { RoleController } from '../controllers/RoleController';
import { RoleService } from '@/modules/role/application/services/RoleService';
import { RoleRepositoryImpl } from '@/modules/role/infrastructure/repositories/RoleRepositoryImpl';
import RoleSequelizeModel from '@/modules/role/infrastructure/models/RoleSequelizeModel';
import { authMiddleware } from '@/modules/auth/presentation/middlewares/authMiddleware';

const roleRepository = new RoleRepositoryImpl(RoleSequelizeModel);
const roleService = new RoleService(roleRepository);
const roleController = new RoleController(roleService);

const router = Router();

router.post('/', authMiddleware, (req: Request, res: Response) => roleController.create(req, res));
router.get('/', authMiddleware, (req: Request, res: Response) => roleController.findAll(req, res));
router.get('/:id', authMiddleware, (req: Request, res: Response) => roleController.findById(req, res));
router.patch('/:id', authMiddleware, (req: Request, res: Response) => roleController.patch(req, res));
router.delete('/:id', authMiddleware, (req: Request, res: Response) => roleController.delete(req, res));

export default router;
