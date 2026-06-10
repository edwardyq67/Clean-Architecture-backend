import { EntityId } from '@/shared/domain/EntityId';

export class CategoryId extends EntityId {
    static create(): CategoryId {
        return new CategoryId();
    }

    static fromString(id: string): CategoryId {
        return new CategoryId(id);
    }
}