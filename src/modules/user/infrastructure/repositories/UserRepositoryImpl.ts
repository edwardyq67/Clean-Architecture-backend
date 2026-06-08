import { Op } from 'sequelize';
import { UserRepository } from '@/modules/user/domain/repositories/UserRepository';
import { User } from '@/modules/user/domain/entities/User';
import { UserId } from '@/modules/user/domain/value-objects/UserId';
import { UserEmail } from '@/modules/user/domain/value-objects/UserEmail';
import { PaginationOptions, PaginatedResult } from '@/shared/application/pagination';
import UserSequelizeModel from '../models/UserSequelizeModel';
import RoleSequelizeModel from '@/modules/role/infrastructure/models/RoleSequelizeModel';
import { UserNotFoundError } from '@/modules/user/domain/exceptions/UserNotFoundError';
import { redisClient } from '@/config/redis';
import HttpError from '@/utils/HttpError';

export class UserRepositoryImpl implements UserRepository {
    constructor(private readonly userModel: typeof UserSequelizeModel) {}

    async create(user: User): Promise<void> {
        if (!this.associationsAvailable()) {
            throw new Error('UserRoles association is required. Configure associations before creating users.');
        }

        if (!Array.isArray(user.roles) || user.roles.length === 0) {
            throw new HttpError(400, 'UserRoles es obligatorio para crear un usuario');
        }

        const sequelize = (this.userModel as any).sequelize;
        if (!sequelize) {
            throw new Error('No se pudo acceder a la instancia de Sequelize');
        }

        await sequelize.transaction(async (transaction: any) => {
            const data = user.toDatabase();
            const created = await this.userModel.create(data, { transaction });
            await this.syncRoles(created, user.roles, transaction);
        });

        await this.cacheUser(user);
    }

    async findById(id: UserId): Promise<User | null> {
        const cacheKey = this.getUserCacheKeyById(id.toString());
        const cached = await redisClient.get(cacheKey);
        if (cached) {
            const cachedUser = this.parseCachedUser(cached);
            const raw = await this.userModel.findByPk(id.toString(), {
                include: [{ model: RoleSequelizeModel, through: { attributes: [] } }]
            });
            if (!raw) {
                await this.invalidateUserCache(id.toString(), cachedUser.email.toString());
                return null;
            }
            const user = this.toDomain(raw.toJSON());
            await this.cacheUser(user);
            return user;
        }

        const raw = await this.userModel.findByPk(id.toString(), {
            include: [{ model: RoleSequelizeModel, as: 'RoleSequelizeModels', through: { attributes: [] } }]
        });
        if (!raw) {
            return null;
        }

        const user = this.toDomain(raw.toJSON());
        await this.cacheUser(user);
        return user;
    }

    async findByEmail(email: UserEmail): Promise<User | null> {
        const cacheKey = this.getUserCacheKeyByEmail(email.toString());
        const cached = await redisClient.get(cacheKey);
        if (cached) {
            const cachedUser = this.parseCachedUser(cached);
            const raw = await this.userModel.findOne({
                where: { email: email.toString() },
                include: [{ model: RoleSequelizeModel, through: { attributes: [] } }]
            });
            if (!raw) {
                await this.invalidateUserCache(cachedUser.id.toString(), email.toString());
                return null;
            }
            const user = this.toDomain(raw.toJSON());
            await this.cacheUser(user);
            return user;
        }

        const raw = await this.userModel.findOne({
            where: { email: email.toString() },
            include: [{ model: RoleSequelizeModel, as: 'RoleSequelizeModels', through: { attributes: [] } }]
        });
        if (!raw) {
            return null;
        }

        const user = this.toDomain(raw.toJSON());
        await this.cacheUser(user);
        return user;
    }

    async findAll(options: PaginationOptions = {}, filters?: { name?: string; role?: string }): Promise<PaginatedResult<User>> {
        const page = options.page && options.page > 0 ? options.page : 1;
        const limit = options.limit && options.limit > 0 ? options.limit : 10;
        const offset = (page - 1) * limit;

        const where: any = {};
        if (filters?.name) {
            where.name = { [Op.like]: `%${filters.name}%` };
        }
        const include: any[] = [{ model: RoleSequelizeModel, through: { attributes: [] } }];
        if (filters?.role) {
            include[0].where = { name: { [Op.like]: `%${filters.role}%` } };
            include[0].required = true;
        }

        const result = await this.userModel.findAndCountAll({
            distinct: true,
            limit,
            offset,
            where,
            include,
            order: [['created_at', 'DESC']]
        });

        const data = result.rows.map(raw => this.toDomain(raw.toJSON()));
        const total = Array.isArray(result.count) ? result.count.length : result.count;
        const totalPages = Math.max(1, Math.ceil(total / limit));

        return {
            data,
            total,
            page,
            limit,
            totalPages
        };
    }

    async patch(user: User): Promise<void> {
        const current = await this.userModel.findByPk(user.id.toString());
        const oldEmail = current?.get('email') as string | undefined;

        const data = user.toDatabase();
        await this.userModel.update(data, {
            where: { id: user.id.toString() }
        });

        const updated = await this.userModel.findByPk(user.id.toString());
        if (updated) {
            if (!this.associationsAvailable()) {
                throw new Error('UserRoles association is required. Configure associations before updating users.');
            }
            await this.syncRoles(updated, user.roles);
        }

        await this.invalidateUserCache(user.id.toString(), oldEmail);
        await this.cacheUser(user);
    }

    async delete(id: UserId): Promise<void> {
        const current = await this.userModel.findByPk(id.toString());
        const oldEmail = current?.get('email') as string | undefined;

        const result = await this.userModel.destroy({
            where: { id: id.toString() }
        });
        if (result === 0) {
            throw new UserNotFoundError(`Usuario con ID ${id.toString()} no encontrado`);
        }

        await this.invalidateUserCache(id.toString(), oldEmail);
    }

    private getUserCacheKeyById(id: string): string {
        return `user:id:${id}`;
    }

    private getUserCacheKeyByEmail(email: string): string {
        return `user:email:${email}`;
    }

    private async cacheUser(user: User): Promise<void> {
        const payload = {
            id: user.id.toString(),
            name: user.name.toString(),
            email: user.email.toString(),
            passwordHash: user.passwordHash,
            roles: user.roles,
            isActive: user.isActive,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
            lastLoginAt: user.lastLoginAt ? user.lastLoginAt.toISOString() : null
        };

        const value = JSON.stringify(payload);
        await redisClient.set(this.getUserCacheKeyById(user.id.toString()), value, { EX: 300 });
        await redisClient.set(this.getUserCacheKeyByEmail(user.email.toString()), value, { EX: 300 });
    }

    private parseCachedUser(cached: string): User {
        const parsed = JSON.parse(cached);
        return User.reconstitute({
            id: parsed.id,
            name: parsed.name,
            email: parsed.email,
            passwordHash: parsed.passwordHash,
            roles: parsed.roles,
            isActive: parsed.isActive,
            createdAt: new Date(parsed.createdAt),
            updatedAt: new Date(parsed.updatedAt),
            lastLoginAt: parsed.lastLoginAt ? new Date(parsed.lastLoginAt) : null
        });
    }

    private async invalidateUserCache(id: string, email?: string): Promise<void> {
        const keys = [this.getUserCacheKeyById(id)];
        if (email) {
            keys.push(this.getUserCacheKeyByEmail(email));
        }
        await redisClient.del(keys);
    }

    private toDomain(raw: any): User {
        return User.reconstitute({
            id: raw.id,
            name: raw.name,
            email: raw.email,
            passwordHash: raw.password_hash,
            roles: raw.Roles ? raw.Roles.map((role: any) => role.name) : [],
            isActive: raw.is_active,
            createdAt: new Date(raw.created_at),
            updatedAt: new Date(raw.updated_at),
            lastLoginAt: raw.last_login_at ? new Date(raw.last_login_at) : null
        });
    }

    private async syncRoles(userRow: any, roles: string[], transaction?: any): Promise<void> {
        if (!Array.isArray(roles) || roles.length === 0) {
            throw new HttpError(400, 'UserRoles es obligatorio para crear un usuario');
        }

        const userId = userRow?.id || userRow?.get?.('id') || userRow?.dataValues?.id;
        if (!userRow || !userId) {
            throw new HttpError(400, 'No se puede sincronizar roles: el usuario no tiene un id válido');
        }

        const roleRecords = await Promise.all(
            roles.map(async (name) => {
                if (typeof name !== 'string' || name.trim() === '') {
                    throw new HttpError(400, 'UserRoles contiene un nombre de rol inválido');
                }
                const normalized = name.trim();
                const [role] = await RoleSequelizeModel.findOrCreate({
                    where: { name: normalized },
                    defaults: { name: normalized },
                    transaction
                });
                return role;
            })
        );

        // Prefer the typed accessor if available, otherwise fall back to legacy $set
        if (typeof (userRow as any).setRoles === 'function') {
            await (userRow as any).setRoles(roleRecords, { transaction });
        } else if (typeof (userRow as any).$set === 'function') {
            await (userRow as any).$set('Roles', roleRecords, { transaction });
        } else {
            // As a last resort, insert into join table directly
            const UserRoles = (userRow.sequelize && userRow.sequelize.models && userRow.sequelize.models.UserRoles) || null;
            if (UserRoles) {
                // Determine column names dynamically from the join model attributes
                const rawAttrs = (UserRoles as any).rawAttributes || {};
                const userKey = Object.keys(rawAttrs).find(key => key.toLowerCase().includes('user')) || 'UserId';
                const roleKey = Object.keys(rawAttrs).find(key => key.toLowerCase().includes('role')) || 'RoleId';

                // remove existing
                await UserRoles.destroy({ where: { [userKey]: userId }, transaction });
                const pairs = roleRecords.map((r: any) => {
                    const roleId = r?.id || r?.get?.('id') || r?.dataValues?.id;
                    if (!roleId) {
                        throw new Error('No se pudo obtener el id del rol para sincronizar UserRoles');
                    }
                    return { [userKey]: userId, [roleKey]: roleId };
                });
                if (pairs.length) await UserRoles.bulkCreate(pairs, { transaction });
            } else {
                throw new Error('No method available to sync roles association');
            }
        }
    }

    private associationsAvailable(): boolean {
        try {
            const assocPresent = !!(this.userModel && (this.userModel as any).associations && (this.userModel as any).associations.Roles);
            const joinModelPresent = !!(this.userModel && (this.userModel as any).sequelize && (this.userModel as any).sequelize.models && (this.userModel as any).sequelize.models.UserRoles);
            return assocPresent || joinModelPresent;
        } catch (e) {
            return false;
        }
    }
}
