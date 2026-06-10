import { Category } from '../entities/Category';
import { CategoryId } from '../value-objects/CategoryId';
import { PaginationOptions, PaginatedResult } from '@/shared/application/pagination';

export interface CategoryRepository {
    create(category: Category): Promise<void>;
    findById(id: CategoryId): Promise<Category | null>;
    findByName(name: string): Promise<Category | null>;
    findAll(options?: PaginationOptions, filters?: { name?: string }): Promise<PaginatedResult<Category>>;
    patch(category: Category): Promise<void>;
    delete(id: CategoryId): Promise<void>;
}
