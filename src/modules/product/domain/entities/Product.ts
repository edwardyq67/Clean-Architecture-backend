import { AuditableEntity } from '@/shared/domain/AuditableEntity';
import { ProductId } from '../value-objects/ProductId';
import { ProductName } from '../value-objects/ProductName';
import { ProductDescription } from '../value-objects/ProductDescription';
import { Price } from '../value-objects/Price';
import { Stock } from '../value-objects/Stock';
import { Image } from '../value-objects/Image';
import { CategoryId } from '@/modules/category/domain/value-objects/CategoryId';

export interface ProductProps {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    image: string;
    categoryId: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export class Product extends AuditableEntity {
    private constructor(
        id: ProductId,
        private _name: ProductName,
        private _description: ProductDescription,
        private _price: Price,
        private _stock: Stock,
        private _image: Image,
        private _categoryId: CategoryId,
        isActive: boolean,
        createdAt: Date,
        updatedAt: Date
    ) {
        super(id, isActive, createdAt, updatedAt);
    }

    get name(): ProductName { return this._name; }
    get description(): ProductDescription { return this._description; }
    get price(): Price { return this._price; }
    get stock(): Stock { return this._stock; }
    get image(): Image { return this._image; }
    get categoryId(): CategoryId { return this._categoryId; }

    static create(
        name: string,
        description: string,
        price: number,
        stock: number,
        image: string,
        categoryId: string
    ): Product {
        const now = new Date();
        return new Product(
            ProductId.create(),
            ProductName.create(name),
            ProductDescription.create(description),
            Price.create(price),
            Stock.create(stock),
            Image.create(image),
            CategoryId.fromString(categoryId),
            true,
            now,
            now
        );
    }

    static reconstitute(props: ProductProps): Product {
        return new Product(
            ProductId.fromString(props.id),
            ProductName.create(props.name),
            ProductDescription.create(props.description),
            Price.create(props.price),
            Stock.create(props.stock),
            Image.create(props.image),
            CategoryId.fromString(props.categoryId),
            props.isActive,
            props.createdAt,
            props.updatedAt
        );
    }

    changeName(name: string): void {
        this._name = ProductName.create(name);
        this._updatedAt = new Date();
    }

    changeDescription(description: string): void {
        this._description = ProductDescription.create(description);
        this._updatedAt = new Date();
    }

    changePrice(price: number): void {
        this._price = Price.create(price);
        this._updatedAt = new Date();
    }

    changeStock(stock: number): void {
        this._stock = Stock.create(stock);
        this._updatedAt = new Date();
    }

    changeImage(image: string): void {
        this._image = Image.create(image);
        this._updatedAt = new Date();
    }

    changeCategory(categoryId: string): void {
        this._categoryId = CategoryId.fromString(categoryId);
        this._updatedAt = new Date();
    }

    toDatabase() {
        return {
            id: this.id.toString(),
            name: this._name.toString(),
            description: this._description.toString(),
            price: this._price.value,
            stock: this._stock.value,
            image: this._image.toString(),
            category_id: this._categoryId.toString(),
            is_active: this._isActive,
            created_at: this._createdAt,
            updated_at: this._updatedAt
        };
    }

}
