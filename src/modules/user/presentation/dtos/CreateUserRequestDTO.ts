export interface CreateUserRequestDTO {
    name: string;
    email: string;
    password: string;
    UserRoles: string | string[];
    role?: 'admin' | 'user' | 'moderator';
    // Optional: accept explicit role names array if needed
    roles?: Array<'admin' | 'user' | 'moderator'>;
}
