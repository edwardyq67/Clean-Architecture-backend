import bcrypt from 'bcrypt';
import { sign, verify, Secret, SignOptions } from 'jsonwebtoken';
import { env } from '@/config/env';
import { UserRepository } from '@/modules/user/domain/repositories/UserRepository';
import { UserEmail } from '@/modules/user/domain/value-objects/UserEmail';
import { User } from '@/modules/user/domain/entities/User';

type TokenPayload = {
    sub: string;
    email: string;
    roles: string[];
};

export class AuthService {
    constructor(private readonly userRepository: UserRepository) {}

    private generateAccessToken(payload: TokenPayload): string {
        return sign(
            payload,
            env.JWT_SECRET as Secret,
            { expiresIn: env.JWT_EXPIRES_IN } as SignOptions
        );
    }

    private generateRefreshToken(payload: TokenPayload): string {
        return sign(
            payload,
            env.JWT_REFRESH_SECRET as Secret,
            { expiresIn: env.JWT_REFRESH_EXPIRES_IN } as SignOptions
        );
    }

    async login(email: string, password: string): Promise<{ token: string; refreshToken: string; user: User }> {
        const userEmail = UserEmail.create(email);
        const user = await this.userRepository.findByEmail(userEmail);

        if (!user || !user.isActive) {
            throw new Error('Credenciales inválidas');
        }

        const validPassword = await bcrypt.compare(password, user.passwordHash);
        if (!validPassword) {
            throw new Error('Credenciales inválidas');
        }

        user.recordLogin();
        await this.userRepository.patch(user);

        const payload: TokenPayload = {
            sub: user.id.toString(),
            email: user.email.toString(),
            roles: user.roles
        };

        const token = this.generateAccessToken(payload);
        const refreshToken = this.generateRefreshToken(payload);

        return { token, refreshToken, user };
    }

    async refresh(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
        let payload: TokenPayload;
        try {
            payload = verify(refreshToken, env.JWT_REFRESH_SECRET as Secret) as TokenPayload;
        } catch {
            throw new Error('Refresh token inválido o expirado');
        }

        if (!payload.sub || !payload.email || !payload.roles) {
            throw new Error('Refresh token inválido');
        }

        const newPayload: TokenPayload = {
            sub: payload.sub,
            email: payload.email,
            roles: payload.roles
        };

        const token = this.generateAccessToken(newPayload);
        const newRefreshToken = this.generateRefreshToken(newPayload);

        return { token, refreshToken: newRefreshToken };
    }
}
