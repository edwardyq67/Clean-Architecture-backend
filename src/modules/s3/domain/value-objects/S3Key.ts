import { ValueObject } from '@/shared/domain/ValueObject';

export class S3Key extends ValueObject {
    private constructor(private readonly _value: string) {
        super();
    }

    get value(): string {
        return this._value;
    }

    static create(key: string): S3Key {
        if (!key || key.trim().length === 0) {
            throw new Error('S3 key cannot be empty');
        }
        return new S3Key(key.trim());
    }

    static fromUrl(url: string): S3Key {
        const parsed = new URL(url);
        const key = parsed.pathname.slice(1);
        return new S3Key(key);
    }

    protected getEqualityComponents(): any[] {
        return [this._value];
    }

    toString(): string {
        return this._value;
    }
}
