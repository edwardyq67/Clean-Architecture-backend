import { ValueObject } from '@/shared/domain/ValueObject';

export class Stock extends ValueObject {
    private constructor(private readonly _value: number) {
        super();
    }

    get value(): number {
        return this._value;
    }

    static create(stock: number): Stock {
        if (!Number.isInteger(stock)) {
            throw new Error('El stock debe ser un número entero');
        }
        if (stock < 0) {
            throw new Error('El stock no puede ser negativo');
        }
        return new Stock(stock);
    }

    protected getEqualityComponents(): any[] {
        return [this._value];
    }

    toString(): string {
        return this._value.toString();
    }
}
