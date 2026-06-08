import { User } from '../entities/User';
import { UserId } from '../value-objects/UserId';
import { UserEmail } from '../value-objects/UserEmail';
import { PaginationOptions, PaginatedResult } from '@/shared/application/pagination';


export interface UserRepository {
    create(user: User): Promise<void>;
    findById(id: UserId): Promise<User | null>;
    findByEmail(email: UserEmail): Promise<User | null>;
    findAll(options?: PaginationOptions, filters?: { name?: string; role?: string }): Promise<PaginatedResult<User>>;
    patch(user: User): Promise<void>;
    delete(id: UserId): Promise<void>;
}