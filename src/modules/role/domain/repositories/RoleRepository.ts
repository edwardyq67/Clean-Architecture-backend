import { Role } from '../entities/Role';
import { RoleId } from '../value-objects/RoleId';
import { PaginationOptions, PaginatedResult } from '@/shared/application/pagination';

export interface RoleRepository {
    create(role: Role): Promise<void>;
    findById(id: RoleId): Promise<Role | null>;
    findByName(name: string): Promise<Role | null>;
    findAll(options?: PaginationOptions, filters?: { name?: string }): Promise<PaginatedResult<Role>>;
    patch(role: Role): Promise<void>;
    delete(id: RoleId): Promise<void>;
}
