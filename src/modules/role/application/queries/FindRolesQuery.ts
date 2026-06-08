import { PaginationQuery } from '@/shared/application/queries/PaginationQuery';

export class FindRolesQuery extends PaginationQuery {
    constructor(
        page?: number,
        limit?: number,
        public readonly filters?: { name?: string }
    ) {
        super(page, limit);
    }
}
