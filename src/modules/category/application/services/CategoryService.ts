import { Category } from '@/modules/category/domain/entities/Category';
import { CategoryRepository } from '@/modules/category/domain/repositories/CategoryRepository';
import { CategoryId } from '@/modules/category/domain/value-objects/CategoryId';
import { PaginatedResult } from '@/shared/application/pagination';

export class CategoryService {
    constructor(private readonly categoryRepository: CategoryRepository) {}

    async create(name: string): Promise<void> {
        const existing = await this.categoryRepository.findByName(name.trim());
        if (existing) {
            throw new Error(`La categoría ${name} ya existe`);
        }
        const category = Category.create(name);
        await this.categoryRepository.create(category);
    }

    async findById(id: CategoryId): Promise<Category> {
        const category = await this.categoryRepository.findById(id);
        if (!category) {
            throw new Error(`Categoría con ID ${id.toString()} no encontrada`);
        }
        return category;
    }

    async findAll(page: number, limit: number, filters?: { name?: string }): Promise<PaginatedResult<Category>> {
        return this.categoryRepository.findAll({ page, limit }, filters);
    }

    async patch(category: Category): Promise<void> {
        const existing = await this.categoryRepository.findById(category.id);
        if (!existing) {
            throw new Error(`Categoría con ID ${category.id.toString()} no encontrada`);
        }
        await this.categoryRepository.patch(category);
    }

    async delete(id: CategoryId): Promise<void> {
        const existing = await this.categoryRepository.findById(id);
        if (!existing) {
            throw new Error(`Categoría con ID ${id.toString()} no encontrada`);
        }
        await this.categoryRepository.delete(id);
    }
}
