import dotenv from 'dotenv';
import path from 'path';

// Cargar .env desde la raíz del proyecto
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const requiredEnvs = [
    'DB_HOST',
    'DB_USER',
    'DB_PASSWORD',
    'DB_NAME',
    'JWT_SECRET',
    'JWT_REFRESH_SECRET',
    'FRONTEND_URL',
    'AWS_BUCKET_NAME',
    'AWS_REGION',
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY'
] as const;

for (const key of requiredEnvs) {
    if (!process.env[key]) {
        throw new Error(`Variable de entorno obligatoria faltante: ${key}`);
    }
}

function envInt(key: string, defaultVal: number): number {
    const val = process.env[key];
    if (val === undefined || val === '') return defaultVal;
    const parsed = parseInt(val, 10);
    if (isNaN(parsed)) throw new Error(`Variable de entorno ${key} debe ser un número válido`);
    return parsed;
}

export const env = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: envInt('PORT', 3000),

    DB_HOST: process.env.DB_HOST!,
    DB_PORT: envInt('DB_PORT', 5432),
    DB_USER: process.env.DB_USER!,
    DB_PASSWORD: process.env.DB_PASSWORD!,
    DB_NAME: process.env.DB_NAME!,

    REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',

    JWT_SECRET: process.env.JWT_SECRET!,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',

    FRONTEND_URL: process.env.FRONTEND_URL!,

    AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME!,
    AWS_REGION: process.env.AWS_REGION!,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID!,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY!,
};