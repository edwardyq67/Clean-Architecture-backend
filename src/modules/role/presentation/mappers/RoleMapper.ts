import { Role } from '@/modules/role/domain/entities/Role';
import { RoleResponseDTO } from '../dtos/RoleResponseDTO';

export class RoleMapper {
    static toResponse(role: Role): RoleResponseDTO {
        return {
            id: role.id.toString(),
            name: role.name
        };
    }
}
