import { AuditableEntity } from '@/shared/domain/AuditableEntity';
import { CategoryId } from '../value-objects/CategoryId';
import { CategoryName } from '../value-objects/CategoryName';

export interface CategoryProps {
    id: string;
    name: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export class Category extends AuditableEntity {
    private constructor(
        id: CategoryId,
        private _name: CategoryName,
        isActive: boolean,
        createdAt: Date,
        updatedAt: Date
    ) {
        super(id, isActive, createdAt, updatedAt);
    }

    get name(): CategoryName { return this._name; }

    changeName(name: string): void {
        this._name = CategoryName.create(name);
        this._updatedAt = new Date();
    }

    static create(name: string): Category {
        const now = new Date();
        return new Category(CategoryId.create(), CategoryName.create(name), true, now, now);
    }

    static reconstitute(props: CategoryProps): Category {
        return new Category(CategoryId.fromString(props.id), CategoryName.create(props.name), props.isActive, props.createdAt, props.updatedAt);
    }
    toDatabase() {
        return {
            id: this.id.toString(),
            name: this._name.toString(),
            is_active: this._isActive,
            created_at: this._createdAt,
            updated_at: this._updatedAt
        };
    }
}
