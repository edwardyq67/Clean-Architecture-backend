import { EntityId } from '@/shared/domain/EntityId';

export class UserId extends EntityId {
    static create(): UserId {
        return new UserId();
    }

    static fromString(id: string): UserId {
        return new UserId(id);
    }
}