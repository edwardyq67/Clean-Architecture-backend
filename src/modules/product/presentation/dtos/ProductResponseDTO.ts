export interface ProductResponseDTO {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    image: string;
    categoryId: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}
