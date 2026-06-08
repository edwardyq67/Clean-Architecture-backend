import { Router, Request, Response } from 'express';
import { AuthController } from '../controllers/AuthController';
import { AuthService } from '@/modules/auth/application/services/AuthService';
import { UserRepositoryImpl } from '@/modules/user/infrastructure/repositories/UserRepositoryImpl';
import UserSequelizeModel from '@/modules/user/infrastructure/models/UserSequelizeModel';

const router = Router();
const userRepository = new UserRepositoryImpl(UserSequelizeModel);
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

router.post('/login', (req: Request, res: Response) => authController.login(req, res));
router.post('/refresh', (req: Request, res: Response) => authController.refresh(req, res));

export default router;
