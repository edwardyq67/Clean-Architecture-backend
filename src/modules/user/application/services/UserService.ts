import { User } from '@/modules/user/domain/entities/User';
import { UserRepository } from '@/modules/user/domain/repositories/UserRepository';
import { UserId } from '@/modules/user/domain/value-objects/UserId';
import { UserEmail } from '@/modules/user/domain/value-objects/UserEmail';
import { FindUsersQuery } from '@/modules/user/application/queries/FindUsersQuery';
import { PaginatedResult } from '@/shared/application/pagination';
import HttpError from '@/utils/HttpError';

export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    // Crear usuario
    async create(user: User): Promise<void> {
        if (!user.roles || user.roles.length === 0) {
            throw new HttpError(400, 'UserRoles es obligatorio para crear un usuario');
        }

        const existingUser = await this.userRepository.findByEmail(user.email);
        if (existingUser) {
            throw new Error(`El email ${user.email.toString()} ya está registrado`);
        }
        await this.userRepository.create(user);
    }

    // Actualización parcial
    async patch(user: User): Promise<void> {
        const existingUser = await this.userRepository.findById(user.id);
        if (!existingUser) {
            throw new Error(`Usuario con ID ${user.id.toString()} no encontrado`);
        }
        await this.userRepository.patch(user);
    }

    // Obtener por ID
    async findById(id: UserId): Promise<User> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new Error(`Usuario con ID ${id.toString()} no encontrado`);
        }
        return user;
    }

    // Obtener por email
    async findByEmail(email: UserEmail): Promise<User | null> {
        return this.userRepository.findByEmail(email);
    }

    // Obtener todos con paginación (usa Query de aplicación)
    async findAll(query: FindUsersQuery): Promise<PaginatedResult<User>> {
        const options = { page: query.getPage(), limit: query.getLimit() };
        return this.userRepository.findAll(options, query.filters);
    }

    // Eliminar
    async delete(id: UserId): Promise<void> {
        const existingUser = await this.userRepository.findById(id);
        if (!existingUser) {
            throw new Error(`Usuario con ID ${id.toString()} no encontrado`);
        }
        await this.userRepository.delete(id);
    }
}