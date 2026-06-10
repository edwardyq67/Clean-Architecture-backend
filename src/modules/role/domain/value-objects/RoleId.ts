import { EntityId } from '@/shared/domain/EntityId';

export class RoleId extends EntityId {
    static create(): RoleId {
        return new RoleId();
    }

    static fromString(id: string): RoleId {
        return new RoleId(id);
    }
}
