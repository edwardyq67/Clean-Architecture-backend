import { Op } from 'sequelize';
import { ProductRepository } from '@/modules/product/domain/repositories/ProductRepository';
import { Product } from '@/modules/product/domain/entities/Product';
import { ProductId } from '@/modules/product/domain/value-objects/ProductId';
import { PaginationOptions, PaginatedResult } from '@/shared/application/pagination';
import ProductSequelizeModel from '../models/ProductSequelizeModel';

export class ProductRepositoryImpl implements ProductRepository {
    constructor(private readonly productModel: typeof ProductSequelizeModel) {}

    async create(product: Product): Promise<void> {
        const data = product.toDatabase();
        await this.productModel.create(data);
    }

    async findById(id: ProductId): Promise<Product | null> {
        const raw = await this.productModel.findByPk(id.toString());
        if (!raw) return null;
        return this.toDomain(raw.toJSON());
    }

    async findAll(
        options: PaginationOptions = {},
        filters?: { name?: string; categoryId?: string }
    ): Promise<PaginatedResult<Product>> {
        const page = options.page && options.page > 0 ? options.page : 1;
        const limit = options.limit && options.limit > 0 ? options.limit : 10;
        const offset = (page - 1) * limit;

        const where: any = { is_active: true };
        if (filters?.name) {
            where.name = { [Op.like]: `%${filters.name}%` };
        }
        if (filters?.categoryId) {
            where.category_id = filters.categoryId;
        }

        const result = await this.productModel.findAndCountAll({
            limit,
            offset,
            where,
            order: [['created_at', 'DESC']]
        });

        const data = result.rows.map(raw => this.toDomain(raw.toJSON()));
        const total = Array.isArray(result.count) ? result.count.length : result.count;
        const totalPages = Math.max(1, Math.ceil(total / limit));

        return { data, total, page, limit, totalPages };
    }

    async patch(product: Product): Promise<void> {
        const data = product.toDatabase();
        await this.productModel.update(data, {
            where: { id: product.id.toString() }
        });
    }

    async delete(id: ProductId): Promise<void> {
        const result = await this.productModel.destroy({ where: { id: id.toString() } });
        if (result === 0) {
            throw new Error(`Producto con ID ${id.toString()} no encontrado`);
        }
    }

    private toDomain(raw: any): Product {
        return Product.reconstitute({
            id: raw.id,
            name: raw.name,
            description: raw.description,
            price: raw.price,
            stock: raw.stock,
            image: raw.image,
            categoryId: raw.category_id,
            isActive: raw.is_active,
            createdAt: new Date(raw.created_at),
            updatedAt: new Date(raw.updated_at)
        });
    }
}
