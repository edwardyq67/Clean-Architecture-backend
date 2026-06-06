import { CorsOptions } from 'cors';
import { env } from './env';

// Configuración de CORS
export const corsConfig: CorsOptions = {
    origin: env.NODE_ENV === 'development' 
        ? ['http://localhost:5432', 'http://localhost:3000', 'http://localhost:5173']
        : [env.FRONTEND_URL || ''],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    optionsSuccessStatus: 200,
};

// Opciones para desarrollo (más abierto)
export const corsDevelopmentConfig: CorsOptions = {
    origin: '*',
    credentials: false,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};