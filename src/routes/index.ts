import { Router } from 'express';
import userRoutes from '../modules/user/presentation/routes/userRoutes';
import roleRoutes from '../modules/role/presentation/routes/roleRoutes';
import authRoutes from '../modules/auth/presentation/routes/authRoutes';
import productRoutes from '../modules/product/presentation/routes/productRoutes';
import categoryRoutes from '../modules/category/presentation/routes/categoryRoutes';
import s3Routes from '../modules/s3/presentation/routes/s3Routes';

const router = Router();

// Rutas de módulos
router.use('/users', userRoutes);
router.use('/roles', roleRoutes);
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/files', s3Routes);

export default router;