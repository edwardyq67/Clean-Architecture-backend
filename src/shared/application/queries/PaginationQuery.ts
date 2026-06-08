export class PaginationQuery {
    constructor(
        public readonly page?: number,
        public readonly limit?: number
    ) {}

    getPage(): number {
        return this.page && this.page > 0 ? this.page : 1;
    }

    getLimit(): number {
        return this.limit && this.limit > 0 ? this.limit : 10;
    }

    getOffset(): number {
        return (this.getPage() - 1) * this.getLimit();
    }
}
