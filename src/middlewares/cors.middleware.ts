import cors from 'cors';
import { corsConfig, corsDevelopmentConfig } from '../config/cors';
import { env } from '../config/env';

// Middleware CORS listo para usar
export const corsMiddleware = cors(
    env.NODE_ENV === 'development' ? corsDevelopmentConfig : corsConfig
);