import { User } from '@/modules/user/domain/entities/User';
import { UserResponseDTO } from '../dtos/UserResponseDTO';

export class UserMapper {
    static toResponse(user: User): UserResponseDTO {
        return {
            id: user.id.toString(),
            name: user.name.toString(),
            email: user.email.toString(),
            roles: user.roles,
            isActive: user.isActive,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString()
        };
    }
}
