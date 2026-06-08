import { Request, Response } from 'express';
import { AuthService } from '@/modules/auth/application/services/AuthService';
import { LoginRequestDTO } from '../dtos/LoginRequestDTO';
import { UserMapper } from '@/modules/user/presentation/mappers/UserMapper';

export class AuthController {
    constructor(private readonly authService: AuthService) {}

    async login(req: Request, res: Response): Promise<void> {
        try {
            const dto: LoginRequestDTO = req.body;
            if (!dto.email || !dto.password) {
                res.status(400).json({ error: 'Email y password son requeridos' });
                return;
            }

            const { token, refreshToken, user } = await this.authService.login(dto.email, dto.password);
            res.status(200).json({ token, refreshToken, user: UserMapper.toResponse(user) });
        } catch (error: any) {
            res.status(401).json({ error: error.message || 'Credenciales incorrectas' });
        }
    }

    async refresh(req: Request, res: Response): Promise<void> {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                res.status(400).json({ error: 'Refresh token es requerido' });
                return;
            }

            const tokens = await this.authService.refresh(refreshToken);
            res.status(200).json(tokens);
        } catch (error: any) {
            res.status(401).json({ error: error.message || 'Refresh token inválido' });
        }
    }
}
