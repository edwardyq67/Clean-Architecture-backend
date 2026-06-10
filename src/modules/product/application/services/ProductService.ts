import { Product } from '@/modules/product/domain/entities/Product';
import { ProductRepository } from '@/modules/product/domain/repositories/ProductRepository';
import { ProductId } from '@/modules/product/domain/value-objects/ProductId';
import { PaginatedResult } from '@/shared/application/pagination';

export class ProductService {
    constructor(private readonly productRepository: ProductRepository) {}

    async create(product: Product): Promise<void> {
        await this.productRepository.create(product);
    }

    async findById(id: ProductId): Promise<Product> {
        const product = await this.productRepository.findById(id);
        if (!product) {
            throw new Error(`Producto con ID ${id.toString()} no encontrado`);
        }
        return product;
    }

    async findAll(
        page: number,
        limit: number,
        filters?: { name?: string; categoryId?: string }
    ): Promise<PaginatedResult<Product>> {
        return this.productRepository.findAll({ page, limit }, filters);
    }

    async patch(product: Product): Promise<void> {
        const existing = await this.productRepository.findById(product.id);
        if (!existing) {
            throw new Error(`Producto con ID ${product.id.toString()} no encontrado`);
        }
        await this.productRepository.patch(product);
    }

    async delete(id: ProductId): Promise<void> {
        const existing = await this.productRepository.findById(id);
        if (!existing) {
            throw new Error(`Producto con ID ${id.toString()} no encontrado`);
        }
        await this.productRepository.delete(id);
    }
}
