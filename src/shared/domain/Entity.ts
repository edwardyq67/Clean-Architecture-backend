import { EntityId } from './EntityId';

export abstract class Entity {
    protected _id: EntityId;

    constructor(id: EntityId) {
        this._id = id;
    }

    get id(): EntityId {
        return this._id;
    }

    equals(entity: Entity): boolean {
        if (this === entity) return true;
        if (!(entity instanceof Entity)) return false;
        return this._id.equals(entity._id);
    }
}