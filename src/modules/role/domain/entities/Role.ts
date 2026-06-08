import { Entity } from '@/shared/domain/Entity';
import { RoleId } from '../value-objects/RoleId';

export interface RoleProps {
    id: string;
    name: string;
}

export class Role extends Entity<RoleId> {
    private _name: string;

    private constructor(id: RoleId, name: string) {
        super(id);
        this._name = name;
    }

    get name(): string {
        return this._name;
    }

    static create(name: string): Role {
        return new Role(RoleId.create(), name.trim());
    }

    static reconstitute(props: RoleProps): Role {
        return new Role(RoleId.fromString(props.id), props.name);
    }

    changeName(name: string): void {
        this._name = name.trim();
    }

    toDatabase(): { id: string; name: string } {
        return {
            id: this.id.toString(),
            name: this._name
        };
    }
}
