import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

import './modules';
// Importar rutas
import router from './routes';
import  errorHandler  from './utils/errorHandler';
import { corsMiddleware } from './middlewares/cors.middleware';

// Cargar variables de entorno
dotenv.config();

// Esta es nuestra aplicación
const app: Application = express();

// Middlewares 
app.use(express.json());
app.use(helmet({
    crossOriginResourcePolicy: false,
}));
app.use(corsMiddleware);

// Límite global: 100 peticiones por minuto
app.use(rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    message: { error: 'Demasiadas peticiones, intenta de nuevo más tarde' }
}));

// Rutas (prefijo global API)
app.use('/api', router);

// Ruta principal
app.get('/', (req: Request, res: Response) => {
    return res.send("Welcome to express!");
});

// Middleware después de las rutas
app.use(errorHandler);

export default app;