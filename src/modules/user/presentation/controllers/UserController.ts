import { Request, Response } from 'express';
import { UserService } from '@/modules/user/application/services/UserService';
import { FindUsersQuery } from '../../application/queries/FindUsersQuery';
import { User } from '@/modules/user/domain/entities/User';
import { UserId } from '@/modules/user/domain/value-objects/UserId';
import { UserEmail } from '@/modules/user/domain/value-objects/UserEmail';
import { UserMapper } from '../mappers/UserMapper';
import { CreateUserRequestDTO } from '../dtos/CreateUserRequestDTO';
import RoleSequelizeModel from '@/modules/role/infrastructure/models/RoleSequelizeModel';
import { UpdateUserRequestDTO } from '../dtos/UpdateUserRequestDTO';
import { UserNotFoundError } from '@/modules/user/domain/exceptions/UserNotFoundError';
import bcrypt from 'bcrypt';

export class UserController {
    constructor(private readonly userService: UserService) { }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const dto: CreateUserRequestDTO = req.body;

            // Validar datos básicos
            if (!dto.name || !dto.email || !dto.password) {
                res.status(400).json({
                    error: 'nombre, email y password son requeridos'
                });
                return;
            }

            if (!dto.UserRoles) {
                res.status(400).json({ error: 'UserRoles es obligatorio para crear un usuario' });
                return;
            }

            const ids = Array.isArray(dto.UserRoles) ? dto.UserRoles : [dto.UserRoles];
            const validIds = ids.filter(Boolean).map(String);
            if (validIds.length === 0) {
                res.status(400).json({ error: 'UserRoles no puede estar vacío' });
                return;
            }

            const foundRoles = await Promise.all(validIds.map(id => RoleSequelizeModel.findByPk(id)));
            const invalidIds = validIds.filter((_, index) => !foundRoles[index]);
            if (invalidIds.length > 0) {
                res.status(400).json({ error: `Los siguientes UserRoles no existen: ${invalidIds.join(', ')}` });
                return;
            }

            const roleNames = foundRoles.map((role) => {
                const name = (role as any)?.name || (role as any)?.get?.('name');
                return typeof name === 'string' ? name.trim() : undefined;
            });
            const invalidNames = roleNames.map((name, index) => name ? null : validIds[index]).filter(Boolean);
            if (invalidNames.length > 0) {
                res.status(400).json({ error: `Algunos roles referenciados no tienen nombre válido: ${invalidNames.join(', ')}` });
                return;
            }

            const cleanedRoleNames = roleNames as Array<'admin' | 'user' | 'moderator'>;
            const passwordHash = await bcrypt.hash(dto.password, 10);
            const user = User.create(dto.name, dto.email, passwordHash, cleanedRoleNames[0]);
            user.changeRoles(cleanedRoleNames);

            // Guardar en BD
            await this.userService.create(user);

            // Responder con DTO
            const response = UserMapper.toResponse(user);
            res.status(201).json(response);
        } catch (error: any) {
            if (error.message.includes('ya está registrado')) {
                res.status(409).json({ error: error.message });
            } else {
                res.status(500).json({ error: error.message || 'Error al crear usuario' });
            }
        }
    }

    async findById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            if (typeof id !== 'string') {
                res.status(400).json({ error: 'ID inválido' });
                return;
            }

            const userId = new UserId(id);

            const user = await this.userService.findById(userId);
            const response = UserMapper.toResponse(user);

            res.status(200).json(response);
        } catch (error: any) {
            if (error instanceof UserNotFoundError || error.message.includes('no encontrado')) {
                res.status(404).json({ error: error.message });
            } else {
                res.status(500).json({ error: error.message || 'Error al obtener usuario' });
            }
        }
    }

    async findAll(req: Request, res: Response): Promise<void> {
        try {
            const page = req.query.page ? Number(req.query.page) : 1;
            const limit = req.query.limit ? Number(req.query.limit) : 10;

            if (Number.isNaN(page) || page <= 0 || Number.isNaN(limit) || limit <= 0) {
                res.status(400).json({ error: 'Los parámetros page y limit deben ser números positivos' });
                return;
            }

            const query = new FindUsersQuery(page, limit, {
                name: (req.query.name as string) || undefined,
                role: (req.query.role as string) || undefined
            });

            const paginated = await this.userService.findAll(query);
            const response = {
                data: paginated.data.map(user => UserMapper.toResponse(user)),
                page: paginated.page,
                limit: paginated.limit,
                total: paginated.total,
                totalPages: paginated.totalPages
            };

            res.status(200).json(response);
        } catch (error: any) {
            res.status(500).json({ error: error.message || 'Error al obtener usuarios' });
        }
    }

    async findByEmail(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.params;
            if (typeof email !== 'string') {
                res.status(400).json({ error: 'Email inválido' });
                return;
            }

            const userEmail = UserEmail.create(email);
            const user = await this.userService.findByEmail(userEmail);
            if (!user) {
                res.status(404).json({ error: `Usuario con email ${email} no encontrado` });
                return;
            }

            const response = UserMapper.toResponse(user);
            res.status(200).json(response);
        } catch (error: any) {
            if (error instanceof UserNotFoundError || error.message.includes('no encontrado')) {
                res.status(404).json({ error: error.message });
            } else {
                res.status(500).json({ error: error.message || 'Error al obtener usuario' });
            }
        }
    }

    async patch(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const dto: UpdateUserRequestDTO = req.body;

            if (typeof id !== 'string') {
                res.status(400).json({ error: 'ID inválido' });
                return;
            }

            const userId = new UserId(id);

            // Obtener el usuario existente
            const user = await this.userService.findById(userId);

            // Aplicar cambios
            if (dto.name) {
                user.changeName(dto.name);
            }
            if (dto.email) {
                user.changeEmail(dto.email);
            }
            if (dto.role) {
                user.changeRole(dto.role);
            }

            // Guardar cambios
            await this.userService.patch(user);

            // Responder
            const response = UserMapper.toResponse(user);
            res.status(200).json(response);
        } catch (error: any) {
            if (error instanceof UserNotFoundError || error.message.includes('no encontrado')) {
                res.status(404).json({ error: error.message });
            } else if (error.message.includes('ya está registrado')) {
                res.status(409).json({ error: error.message });
            } else {
                res.status(500).json({ error: error.message || 'Error al actualizar usuario' });
            }
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            if (typeof id !== 'string') {
                res.status(400).json({ error: 'ID inválido' });
                return;
            }

            const userId = new UserId(id);

            await this.userService.delete(userId);

            res.status(204).send();
        } catch (error: any) {
            if (error instanceof UserNotFoundError || error.message.includes('no encontrado')) {
                res.status(404).json({ error: error.message });
            } else {
                res.status(500).json({ error: error.message || 'Error al eliminar usuario' });
            }
        }
    }
}
