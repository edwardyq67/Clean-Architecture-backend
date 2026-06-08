import { ValueObject } from './ValueObject';

export abstract class Identifier<T> extends ValueObject {
    private _value: T;

    constructor(value: T) {
        super();
        this._value = value;
    }

    get value(): T {
        return this._value;
    }

    protected getEqualityComponents(): any[] {
        return [this._value];
    }

    toString(): string {
        return String(this._value);
    }
}