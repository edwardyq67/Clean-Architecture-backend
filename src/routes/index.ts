import { Router } from 'express';
import userRoutes from '../modules/user/presentation/routes/userRoutes';
import roleRoutes from '../modules/role/presentation/routes/roleRoutes';
import authRoutes from '../modules/auth/presentation/routes/authRoutes';

const router = Router();

// Rutas de módulos
router.use('/users', userRoutes);
router.use('/roles', roleRoutes);
router.use('/auth', authRoutes);

export default router;