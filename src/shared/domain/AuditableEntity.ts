import { Entity } from './Entity';
import { EntityId } from './EntityId';

export abstract class AuditableEntity extends Entity {
    protected _isActive: boolean;
    protected _createdAt: Date;
    protected _updatedAt: Date;

    constructor(id: EntityId, isActive: boolean, createdAt: Date, updatedAt: Date) {
        super(id);
        this._isActive = isActive;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
    }

    get isActive(): boolean { return this._isActive; }
    get createdAt(): Date { return this._createdAt; }
    get updatedAt(): Date { return this._updatedAt; }

    activate(): void {
        this._isActive = true;
        this._updatedAt = new Date();
    }

    deactivate(): void {
        this._isActive = false;
        this._updatedAt = new Date();
    }
}
