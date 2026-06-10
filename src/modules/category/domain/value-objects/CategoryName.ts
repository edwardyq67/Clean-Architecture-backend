import { Name } from '@/shared/domain/Name';

export class CategoryName extends Name {
    private constructor(value: string) {
        super(value);
    }

    static create(name: string): CategoryName {
        return new CategoryName(Name.create(name).value);
    }
}
