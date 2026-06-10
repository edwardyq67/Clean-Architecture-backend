import { Request, Response } from 'express';
import { ProductService } from '@/modules/product/application/services/ProductService';
import { Product } from '@/modules/product/domain/entities/Product';
import { ProductId } from '@/modules/product/domain/value-objects/ProductId';
import { ProductMapper } from '../mappers/ProductMapper';
import { CreateProductRequestDTO } from '../dtos/CreateProductRequestDTO';
import { UpdateProductRequestDTO } from '../dtos/UpdateProductRequestDTO';
import { S3Service } from '@/shared/application/S3Service';

export class ProductController {
    constructor(
        private readonly productService: ProductService,
        private readonly s3Service: S3Service
    ) {}

    async create(req: Request, res: Response): Promise<void> {
        try {
            const dto: CreateProductRequestDTO = JSON.parse(req.body.data);
            const file = req.file;

            if (!dto.name || !dto.description || dto.price === undefined || dto.stock === undefined || !file || !dto.categoryId) {
                res.status(400).json({ error: 'Todos los campos son requeridos, incluyendo la imagen' });
                return;
            }

            const imageUrl = await this.s3Service.uploadImage(file);
            const product = Product.create(dto.name, dto.description, dto.price, dto.stock, imageUrl, dto.categoryId);
            await this.productService.create(product);
            res.status(201).json(ProductMapper.toResponse(product));
        } catch (error: any) {
            res.status(500).json({ error: error.message || 'Error al crear producto' });
        }
    }

    async findById(req: Request, res: Response): Promise<void> {
        try {
            const id = String(req.params.id);
            const product = await this.productService.findById(new ProductId(id));
            res.status(200).json(ProductMapper.toResponse(product));
        } catch (error: any) {
            res.status(404).json({ error: error.message || 'Producto no encontrado' });
        }
    }

    async findAll(req: Request, res: Response): Promise<void> {
        try {
            const page = req.query.page ? Number(req.query.page) : 1;
            const limit = req.query.limit ? Number(req.query.limit) : 10;

            if (Number.isNaN(page) || page <= 0 || Number.isNaN(limit) || limit <= 0) {
                res.status(400).json({ error: 'page y limit deben ser números positivos' });
                return;
            }

            const filters: { name?: string; categoryId?: string } = {};
            if (req.query.name) filters.name = req.query.name as string;
            if (req.query.categoryId) filters.categoryId = req.query.categoryId as string;

            const paginated = await this.productService.findAll(page, limit, filters);
            res.status(200).json({
                data: paginated.data.map(p => ProductMapper.toResponse(p)),
                page: paginated.page,
                limit: paginated.limit,
                total: paginated.total,
                totalPages: paginated.totalPages
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message || 'Error al obtener productos' });
        }
    }

    async patch(req: Request, res: Response): Promise<void> {
        try {
            const id = String(req.params.id);
            const dto: UpdateProductRequestDTO = JSON.parse(req.body.data);
            const file = req.file;

            const product = await this.productService.findById(new ProductId(id));

            if (dto.name) product.changeName(dto.name);
            if (dto.description) product.changeDescription(dto.description);
            if (dto.price !== undefined) product.changePrice(dto.price);
            if (dto.stock !== undefined) product.changeStock(dto.stock);
            if (dto.categoryId) product.changeCategory(dto.categoryId);
            if (file) {
                const imageUrl = await this.s3Service.uploadImage(file);
                product.changeImage(imageUrl);
            }

            await this.productService.patch(product);
            res.status(200).json(ProductMapper.toResponse(product));
        } catch (error: any) {
            res.status(404).json({ error: error.message || 'Producto no encontrado' });
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            const id = String(req.params.id);
            const product = await this.productService.findById(new ProductId(id));
            await this.s3Service.deleteImage(product.image.toString());
            await this.productService.delete(new ProductId(id));
            res.status(204).send();
        } catch (error: any) {
            res.status(404).json({ error: error.message || 'Producto no encontrado' });
        }
    }
}
