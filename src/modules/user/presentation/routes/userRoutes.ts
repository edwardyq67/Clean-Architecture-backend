import { Router, Request, Response } from 'express';
import { UserController } from '../controllers/UserController';
import { UserService } from '@/modules/user/application/services/UserService';
import { UserRepositoryImpl } from '@/modules/user/infrastructure/repositories/UserRepositoryImpl';
import UserSequelizeModel from '@/modules/user/infrastructure/models/UserSequelizeModel';
import { authMiddleware } from '@/modules/auth/presentation/middlewares/authMiddleware';

// Inicializar dependencias
const userRepository = new UserRepositoryImpl(UserSequelizeModel);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

const router = Router();

// Rutas públicas
router.post('/', (req: Request, res: Response) => userController.create(req, res));

// Rutas protegidas
router.get('/', authMiddleware, (req: Request, res: Response) => userController.findAll(req, res));
router.get('/email/:email', authMiddleware, (req: Request, res: Response) => userController.findByEmail(req, res));
router.get('/:id', authMiddleware, (req: Request, res: Response) => userController.findById(req, res));
router.patch('/:id', authMiddleware, (req: Request, res: Response) => userController.patch(req, res));
router.delete('/:id', authMiddleware, (req: Request, res: Response) => userController.delete(req, res));

export default router;
