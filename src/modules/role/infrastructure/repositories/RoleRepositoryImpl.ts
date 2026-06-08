import { Op } from 'sequelize';
import { RoleRepository } from '@/modules/role/domain/repositories/RoleRepository';
import { Role } from '@/modules/role/domain/entities/Role';
import { RoleId } from '@/modules/role/domain/value-objects/RoleId';
import { PaginationOptions, PaginatedResult } from '@/shared/application/pagination';
import RoleSequelizeModel from '../models/RoleSequelizeModel';

export class RoleRepositoryImpl implements RoleRepository {
    constructor(private readonly roleModel: typeof RoleSequelizeModel) {}

    async create(role: Role): Promise<void> {
        const data = role.toDatabase();
        await this.roleModel.create(data);
    }

    async findById(id: RoleId): Promise<Role | null> {
        const raw = await this.roleModel.findByPk(id.toString());
        if (!raw) return null;
        return this.toDomain(raw.toJSON());
    }

    async findByName(name: string): Promise<Role | null> {
        const raw = await this.roleModel.findOne({ where: { name } });
        if (!raw) return null;
        return this.toDomain(raw.toJSON());
    }

    async findAll(options: PaginationOptions = {}, filters?: { name?: string }): Promise<PaginatedResult<Role>> {
        const page = options.page && options.page > 0 ? options.page : 1;
        const limit = options.limit && options.limit > 0 ? options.limit : 10;
        const offset = (page - 1) * limit;

        const where: any = {};
        if (filters?.name) {
            where.name = { [Op.like]: `%${filters.name}%` };
        }

        const result = await this.roleModel.findAndCountAll({
            limit,
            offset,
            where,
            order: [['name', 'ASC']]
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

    async patch(role: Role): Promise<void> {
        const data = role.toDatabase();
        await this.roleModel.update(data, {
            where: { id: role.id.toString() }
        });
    }

    async delete(id: RoleId): Promise<void> {
        const result = await this.roleModel.destroy({ where: { id: id.toString() } });
        if (result === 0) {
            throw new Error(`Rol con ID ${id.toString()} no encontrado`);
        }
    }

    private toDomain(raw: any): Role {
        return Role.reconstitute({
            id: raw.id,
            name: raw.name
        });
    }
}
