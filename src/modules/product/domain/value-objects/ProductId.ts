import { EntityId } from '@/shared/domain/EntityId';

export class ProductId extends EntityId {
    static create(): ProductId {
        return new ProductId();
    }

    static fromString(id: string): ProductId {
        return new ProductId(id);
    }
}
