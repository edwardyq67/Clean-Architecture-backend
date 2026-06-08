import { Identifier } from '@/shared/domain/Identifier';
import { v4 as uuidv4 } from 'uuid';

export class UserId extends Identifier<string> {
    constructor(id?: string) {
        super(id || uuidv4());
    }

    static create(): UserId {
        return new UserId();
    }

    static fromString(id: string): UserId {
        return new UserId(id);
    }
}