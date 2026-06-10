import { Identifier } from './Identifier';
import { v4 as uuidv4 } from 'uuid';

export class EntityId extends Identifier<string> {
    constructor(id?: string) {
        super(id || uuidv4());
    }

    static create(): EntityId {
        return new EntityId();
    }

    static fromString(id: string): EntityId {
        return new EntityId(id);
    }
}
