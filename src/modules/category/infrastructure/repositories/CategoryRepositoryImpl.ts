import { Op } from 'sequelize';
import { CategoryRepository } from '@/modules/category/domain/repositories/CategoryRepository';
import { Category } from '@/modules/category/domain/entities/Category';
import { CategoryId } from '@/modules/category/domain/value-objects/CategoryId';
import { PaginationOptions, PaginatedResult } from '@/shared/application/pagination';
import CategorySequelizeModel from '../models/CategorySequelizeModel';

export class CategoryRepositoryImpl implements CategoryRepository {
    constructor(private readonly categoryModel: typeof CategorySequelizeModel) {}

    async create(category: Category): Promise<void> {
        const data = category.toDatabase();
        await this.categoryModel.create(data);
    }

    async findById(id: CategoryId): Promise<Category | null> {
        const raw = await this.categoryModel.findByPk(id.toString());
        if (!raw) return null;
        return this.toDomain(raw.toJSON());
    }

    async findByName(name: string): Promise<Category | null> {
        const raw = await this.categoryModel.findOne({ where: { name } });
        if (!raw) return null;
        return this.toDomain(raw.toJSON());
    }

    async findAll(
        options: PaginationOptions = {},
        filters?: { name?: string }
    ): Promise<PaginatedResult<Category>> {
        const page = options.page && options.page > 0 ? options.page : 1;
        const limit = options.limit && options.limit > 0 ? options.limit : 10;
        const offset = (page - 1) * limit;

        const where: any = {};
        if (filters?.name) {
            where.name = { [Op.like]: `%${filters.name}%` };
        }

        const result = await this.categoryModel.findAndCountAll({
            limit,
            offset,
            where,
            order: [['name', 'ASC']]
        });

        const data = result.rows.map(raw => this.toDomain(raw.toJSON()));
        const total = Array.isArray(result.count) ? result.count.length : result.count;
        const totalPages = Math.max(1, Math.ceil(total / limit));

        return { data, total, page, limit, totalPages };
    }

    async patch(category: Category): Promise<void> {
        const data = category.toDatabase();
        await this.categoryModel.update(data, {
            where: { id: category.id.toString() }
        });
    }

    async delete(id: CategoryId): Promise<void> {
        const result = await this.categoryModel.destroy({ where: { id: id.toString() } });
        if (result === 0) {
            throw new Error(`Categoría con ID ${id.toString()} no encontrada`);
        }
    }

    private toDomain(raw: any): Category {
        return Category.reconstitute({
            id: raw.id,
            name: raw.name,
            isActive: raw.is_active,
            createdAt: new Date(raw.created_at),
            updatedAt: new Date(raw.updated_at)
        });
    }
}
