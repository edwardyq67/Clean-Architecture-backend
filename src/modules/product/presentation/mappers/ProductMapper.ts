import { Product } from '@/modules/product/domain/entities/Product';
import { ProductResponseDTO } from '../dtos/ProductResponseDTO';

export class ProductMapper {
    static toResponse(product: Product): ProductResponseDTO {
        return {
            id: product.id.toString(),
            name: product.name.toString(),
            description: product.description.toString(),
            price: product.price.value,
            stock: product.stock.value,
            image: product.image.toString(),
            categoryId: product.categoryId.toString(),
            isActive: product.isActive,
            createdAt: product.createdAt.toISOString(),
            updatedAt: product.updatedAt.toISOString()
        };
    }
}
