import { ValueObject } from '@/shared/domain/ValueObject';

export class Image extends ValueObject {
    private constructor(private readonly _value: string) {
        super();
    }

    get value(): string {
        return this._value;
    }

    static create(image: string): Image {
        if (!image || image.trim().length === 0) {
            throw new Error('La imagen no puede estar vacía');
        }
        return new Image(image.trim());
    }

    protected getEqualityComponents(): any[] {
        return [this._value];
    }

    toString(): string {
        return this._value;
    }
}
