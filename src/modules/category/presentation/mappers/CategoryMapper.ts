import { Category } from '@/modules/category/domain/entities/Category';
import { CategoryResponseDTO } from '../dtos/CategoryResponseDTO';

export class CategoryMapper {
    static toResponse(category: Category): CategoryResponseDTO {
        return {
            id: category.id.toString(),
            name: category.name.toString(),
            isActive: category.isActive,
            createdAt: category.createdAt.toISOString(),
            updatedAt: category.updatedAt.toISOString()
        };
    }
}
