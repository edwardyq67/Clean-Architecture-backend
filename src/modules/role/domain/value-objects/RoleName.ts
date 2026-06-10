import { Name } from '@/shared/domain/Name';

export class RoleName extends Name {
    private constructor(value: string) {
        super(value);
    }

    static create(name: string): RoleName {
        return new RoleName(Name.create(name).value);
    }
}
