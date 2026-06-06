import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';

// Importar rutas
import router from './routes';
import  errorHandler  from './utils/errorHandler';

// Cargar variables de entorno
dotenv.config();

// Esta es nuestra aplicación
const app: Application = express();

// Middlewares 
app.use(express.json());
app.use(helmet({
    crossOriginResourcePolicy: false,
}));
app.use(cors());

// Rutas
app.use(router);

// Ruta principal
app.get('/', (req: Request, res: Response) => {
    return res.send("Welcome to express!");
});

// Middleware después de las rutas
app.use(errorHandler);

export default app;