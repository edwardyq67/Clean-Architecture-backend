import { Role } from '@/modules/role/domain/entities/Role';
import { RoleRepository } from '@/modules/role/domain/repositories/RoleRepository';
import { RoleId } from '@/modules/role/domain/value-objects/RoleId';
import { FindRolesQuery } from '@/modules/role/application/queries/FindRolesQuery';
import { PaginatedResult } from '@/shared/application/pagination';

export class RoleService {
    constructor(private readonly roleRepository: RoleRepository) {}

    async create(name: string): Promise<void> {
        const existingRole = await this.roleRepository.findByName(name.trim());
        if (existingRole) {
            throw new Error(`El rol ${name} ya existe`);
        }
        const role = Role.create(name);
        await this.roleRepository.create(role);
    }

    async findAll(query: FindRolesQuery): Promise<PaginatedResult<Role>> {
        return this.roleRepository.findAll(
            {
                page: query.getPage(),
                limit: query.getLimit()
            },
            query.filters
        );
    }

    async findById(id: RoleId): Promise<Role> {
        const role = await this.roleRepository.findById(id);
        if (!role) {
            throw new Error(`Rol con ID ${id.toString()} no encontrado`);
        }
        return role;
    }

    async patch(role: Role): Promise<void> {
        const existingRole = await this.roleRepository.findById(role.id);
        if (!existingRole) {
            throw new Error(`Rol con ID ${role.id.toString()} no encontrado`);
        }
        if (role.name !== existingRole.name) {
            const duplicate = await this.roleRepository.findByName(role.name);
            if (duplicate && duplicate.id.toString() !== role.id.toString()) {
                throw new Error(`El rol ${role.name} ya existe`);
            }
        }
        await this.roleRepository.patch(role);
    }

    async delete(id: RoleId): Promise<void> {
        const role = await this.roleRepository.findById(id);
        if (!role) {
            throw new Error(`Rol con ID ${id.toString()} no encontrado`);
        }
        await this.roleRepository.delete(id);
    }
}
