import { ValueObject } from '@/shared/domain/ValueObject';

export class UserName extends ValueObject {
    private constructor(private readonly _value: string) {
        super();
    }

    get value(): string {
        return this._value;
    }

    static create(name: string): UserName {
        if (!name || name.trim().length === 0) {
            throw new Error('El nombre no puede estar vacío');
        }
        if (name.length < 2) {
            throw new Error('El nombre debe tener al menos 2 caracteres');
        }
        if (name.length > 100) {
            throw new Error('El nombre no puede tener más de 100 caracteres');
        }
        return new UserName(name.trim());
    }

    protected getEqualityComponents(): any[] {
        return [this._value];
    }

    toString(): string {
        return this._value;
    }
}