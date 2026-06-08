import { Identifier } from '@/shared/domain/Identifier';
import { v4 as uuidv4 } from 'uuid';

export class RoleId extends Identifier<string> {
    constructor(id?: string) {
        super(id || uuidv4());
    }

    static create(): RoleId {
        return new RoleId();
    }

    static fromString(id: string): RoleId {
        return new RoleId(id);
    }
}
