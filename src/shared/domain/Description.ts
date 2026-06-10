import { ValueObject } from './ValueObject';

export class Description extends ValueObject {
    constructor(protected readonly _value: string) {
        super();
    }

    get value(): string {
        return this._value;
    }

    static create(description: string): Description {
        if (!description || description.trim().length === 0) {
            throw new Error('La descripción no puede estar vacía');
        }
        if (description.length > 500) {
            throw new Error('La descripción no puede tener más de 500 caracteres');
        }
        return new Description(description.trim());
    }

    protected getEqualityComponents(): any[] {
        return [this._value];
    }

    toString(): string {
        return this._value;
    }
}
