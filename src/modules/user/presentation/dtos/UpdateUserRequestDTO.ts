export interface UpdateUserRequestDTO {
    name?: string;
    email?: string;
    role?: 'admin' | 'user' | 'moderator';
}
