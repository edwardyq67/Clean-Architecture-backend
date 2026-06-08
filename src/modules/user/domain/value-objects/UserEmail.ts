import { ValueObject } from '@/shared/domain/ValueObject';

export class UserEmail extends ValueObject {
    private constructor(private readonly _value: string) {
        super();
    }

    get value(): string {
        return this._value;
    }

    static create(email: string): UserEmail {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error(`Email inválido: ${email}`);
        }
        return new UserEmail(email.toLowerCase().trim());
    }

    protected getEqualityComponents(): any[] {
        return [this._value];
    }

    toString(): string {
        return this._value;
    }
}