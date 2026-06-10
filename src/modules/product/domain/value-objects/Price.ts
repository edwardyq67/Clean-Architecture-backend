import { ValueObject } from '@/shared/domain/ValueObject';

export class Price extends ValueObject {
    private constructor(private readonly _value: number) {
        super();
    }

    get value(): number {
        return this._value;
    }

    static create(price: number): Price {
        if (price < 0) {
            throw new Error('El precio no puede ser negativo');
        }
        return new Price(price);
    }

    protected getEqualityComponents(): any[] {
        return [this._value];
    }

    toString(): string {
        return this._value.toString();
    }
}
