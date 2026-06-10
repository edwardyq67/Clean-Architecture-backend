import { Product } from '../entities/Product';
import { ProductId } from '../value-objects/ProductId';
import { PaginationOptions, PaginatedResult } from '@/shared/application/pagination';

export interface ProductRepository {
    create(product: Product): Promise<void>;
    findById(id: ProductId): Promise<Product | null>;
    findAll(options?: PaginationOptions, filters?: { name?: string; categoryId?: string }): Promise<PaginatedResult<Product>>;
    patch(product: Product): Promise<void>;
    delete(id: ProductId): Promise<void>;
}
