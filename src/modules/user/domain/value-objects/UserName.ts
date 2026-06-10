import { Name } from '@/shared/domain/Name';

export class UserName extends Name {
    private constructor(value: string) {
        super(value);
    }

    static create(name: string): UserName {
        return new UserName(Name.create(name).value);
    }
}
