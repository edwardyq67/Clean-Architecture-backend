import { Request, Response } from 'express';
import { CategoryService } from '@/modules/category/application/services/CategoryService';
import { CategoryId } from '@/modules/category/domain/value-objects/CategoryId';
import { CategoryMapper } from '../mappers/CategoryMapper';
import { CreateCategoryRequestDTO } from '../dtos/CreateCategoryRequestDTO';
import { UpdateCategoryRequestDTO } from '../dtos/UpdateCategoryRequestDTO';

export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    async create(req: Request, res: Response): Promise<void> {
        try {
            const dto: CreateCategoryRequestDTO = req.body;
            if (!dto.name) {
                res.status(400).json({ error: 'El nombre es requerido' });
                return;
            }
            await this.categoryService.create(dto.name);
            res.status(201).json({ message: 'Categoría creada correctamente' });
        } catch (error: any) {
            if (error.message.includes('ya existe')) {
                res.status(409).json({ error: error.message });
            } else {
                res.status(500).json({ error: error.message || 'Error al crear categoría' });
            }
        }
    }

    async findById(req: Request, res: Response): Promise<void> {
        try {
            const id = String(req.params.id);
            const category = await this.categoryService.findById(new CategoryId(id));
            res.status(200).json(CategoryMapper.toResponse(category));
        } catch (error: any) {
            res.status(404).json({ error: error.message || 'Categoría no encontrada' });
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

            const filters: { name?: string } = {};
            if (req.query.name) filters.name = req.query.name as string;

            const paginated = await this.categoryService.findAll(page, limit, filters);
            res.status(200).json({
                data: paginated.data.map(c => CategoryMapper.toResponse(c)),
                page: paginated.page,
                limit: paginated.limit,
                total: paginated.total,
                totalPages: paginated.totalPages
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message || 'Error al obtener categorías' });
        }
    }

    async patch(req: Request, res: Response): Promise<void> {
        try {
            const id = String(req.params.id);
            const dto: UpdateCategoryRequestDTO = req.body;
            if (!dto.name) {
                res.status(400).json({ error: 'El nombre es requerido' });
                return;
            }

            const category = await this.categoryService.findById(new CategoryId(id));
            category.changeName(dto.name);
            await this.categoryService.patch(category);
            res.status(200).json(CategoryMapper.toResponse(category));
        } catch (error: any) {
            if (error.message.includes('ya existe')) {
                res.status(409).json({ error: error.message });
            } else {
                res.status(404).json({ error: error.message || 'Categoría no encontrada' });
            }
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            const id = String(req.params.id);
            await this.categoryService.delete(new CategoryId(id));
            res.status(204).send();
        } catch (error: any) {
            res.status(404).json({ error: error.message || 'Categoría no encontrada' });
        }
    }
}
