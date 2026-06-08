export interface UserResponseDTO {
    id: string;
    name: string;
    email: string;
    roles: ('admin' | 'user' | 'moderator')[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}
