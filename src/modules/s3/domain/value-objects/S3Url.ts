import { ValueObject } from '@/shared/domain/ValueObject';

export class S3Url extends ValueObject {
    private constructor(private readonly _value: string) {
        super();
    }

    get value(): string {
        return this._value;
    }

    static create(url: string): S3Url {
        if (!url || url.trim().length === 0) {
            throw new Error('S3 URL cannot be empty');
        }
        try {
            new URL(url);
        } catch {
            throw new Error('Invalid URL format');
        }
        return new S3Url(url.trim());
    }

    static build(bucket: string, region: string, key: string): S3Url {
        const url = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
        return new S3Url(url);
    }

    get key(): string {
        const parsed = new URL(this._value);
        return parsed.pathname.slice(1);
    }

    protected getEqualityComponents(): any[] {
        return [this._value];
    }

    toString(): string {
        return this._value;
    }
}
