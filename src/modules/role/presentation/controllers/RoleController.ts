import { Request, Response } from 'express';
import { RoleService } from '@/modules/role/application/services/RoleService';
import { CreateRoleRequestDTO } from '../dtos/CreateRoleRequestDTO';
import { UpdateRoleRequestDTO } from '../dtos/UpdateRoleRequestDTO';
import { RoleMapper } from '../mappers/RoleMapper';
import { RoleId } from '@/modules/role/domain/value-objects/RoleId';
import { Role } from '@/modules/role/domain/entities/Role';
import { FindRolesQuery } from '@/modules/role/application/queries/FindRolesQuery';

export class RoleController {
    constructor(private readonly roleService: RoleService) {}

    async create(req: Request, res: Response): Promise<void> {
        try {
            const dto: CreateRoleRequestDTO = req.body;
            if (!dto.name || typeof dto.name !== 'string') {
                res.status(400).json({ error: 'El nombre del rol es requerido' });
                return;
            }

            await this.roleService.create(dto.name);
            res.status(201).json({ message: 'Rol creado correctamente' });
        } catch (error: any) {
            if (error.message.includes('ya existe')) {
                res.status(409).json({ error: error.message });
            } else {
                res.status(500).json({ error: error.message || 'Error al crear rol' });
            }
        }
    }

    async findAll(req: Request, res: Response): Promise<void> {
        try {
            const page = req.query.page ? Number(req.query.page) : 1;
            const limit = req.query.limit ? Number(req.query.limit) : 10;

            if (Number.isNaN(page) || page <= 0 || Number.isNaN(limit) || limit <= 0) {
                res.status(400).json({ error: 'Los parámetros page y limit deben ser números positivos' });
                return;
            }

            const query = new FindRolesQuery(page, limit, {
                name: (req.query.name as string) || undefined
            });
            const paginated = await this.roleService.findAll(query);
            const response = {
                data: paginated.data.map(role => RoleMapper.toResponse(role)),
                page: paginated.page,
                limit: paginated.limit,
                total: paginated.total,
                totalPages: paginated.totalPages
            };

            res.status(200).json(response);
        } catch (error: any) {
            res.status(500).json({ error: error.message || 'Error al obtener roles' });
        }
    }

    async findById(req: Request, res: Response): Promise<void> {
        try {
            const id = String(req.params.id);
            const roleId = new RoleId(id);
            const role = await this.roleService.findById(roleId);
            res.status(200).json(RoleMapper.toResponse(role));
        } catch (error: any) {
            res.status(404).json({ error: error.message || 'Rol no encontrado' });
        }
    }

    async patch(req: Request, res: Response): Promise<void> {
        try {
            const id = String(req.params.id);
            const dto: UpdateRoleRequestDTO = req.body;
            if (!dto.name || typeof dto.name !== 'string') {
                res.status(400).json({ error: 'El nombre del rol es requerido' });
                return;
            }

            const role = await this.roleService.findById(new RoleId(id));
            role.changeName(dto.name);
            await this.roleService.patch(role);
            res.status(200).json(RoleMapper.toResponse(role));
        } catch (error: any) {
            if (error.message.includes('ya existe')) {
                res.status(409).json({ error: error.message });
            } else {
                res.status(404).json({ error: error.message || 'Rol no encontrado' });
            }
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            const id = String(req.params.id);
            const roleId = new RoleId(id);
            await this.roleService.delete(roleId);
            res.status(204).send();
        } catch (error: any) {
            res.status(404).json({ error: error.message || 'Rol no encontrado' });
        }
    }
}
