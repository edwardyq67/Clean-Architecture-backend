export interface CreateUserRequestDTO {
    name: string;
    email: string;
    password: string;
    UserRoles: string | string[];
    role?: string;
    roles?: string[];
}
