import { Name } from '@/shared/domain/Name';

export class ProductName extends Name {
    private constructor(value: string) {
        super(value);
    }

    static create(name: string): ProductName {
        return new ProductName(Name.create(name).value);
    }
}
