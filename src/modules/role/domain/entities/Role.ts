import { AuditableEntity } from '@/shared/domain/AuditableEntity';
import { RoleId } from '../value-objects/RoleId';

export interface RoleProps {
    id: string;
    name: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export class Role extends AuditableEntity {
    private constructor(
        id: RoleId,
        private _name: string,
        isActive: boolean,
        createdAt: Date,
        updatedAt: Date
    ) {
        super(id, isActive, createdAt, updatedAt);
    }

    get name(): string { return this._name; }

    static create(name: string): Role {
        const now = new Date();
        return new Role(RoleId.create(), name.trim(), true, now, now);
    }

    static reconstitute(props: RoleProps): Role {
        return new Role(
            RoleId.fromString(props.id),
            props.name,
            props.isActive,
            props.createdAt,
            props.updatedAt
        );
    }

    changeName(name: string): void {
        this._name = name.trim();
        this._updatedAt = new Date();
    }

    toDatabase(): { id: string; name: string; is_active: boolean; created_at: Date; updated_at: Date } {
        return {
            id: this.id.toString(),
            name: this._name,
            is_active: this._isActive,
            created_at: this._createdAt,
            updated_at: this._updatedAt
        };
    }
}
