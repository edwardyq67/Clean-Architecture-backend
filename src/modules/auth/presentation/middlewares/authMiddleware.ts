import { Request, Response, NextFunction } from 'express';
import { verify, Secret } from 'jsonwebtoken';
import { env } from '@/config/env';

export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        email: string;
        roles: string[];
    };
}

export const authMiddleware = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): void => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Token de autenticación requerido' });
        return;
    }

    const token = authHeader.split(' ')[1];
    try {
        const payload = verify(token, env.JWT_SECRET as Secret) as {
            sub?: string;
            email?: string;
            roles?: string[];
        };

        if (!payload.sub || !payload.email || !payload.roles) {
            throw new Error('Token inválido');
        }

        req.user = {
            id: payload.sub,
            email: payload.email,
            roles: payload.roles
        };

        next();
    } catch (error: any) {
        res.status(401).json({ error: 'Token inválido o expirado' });
    }
};
