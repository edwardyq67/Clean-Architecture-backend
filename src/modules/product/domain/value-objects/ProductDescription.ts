import { Description } from '@/shared/domain/Description';

export class ProductDescription extends Description {
    private constructor(value: string) {
        super(value);
    }

    static create(description: string): ProductDescription {
        return new ProductDescription(Description.create(description).value);
    }
}
