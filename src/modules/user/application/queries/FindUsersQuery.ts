import { PaginationQuery } from '@/shared/application/queries/PaginationQuery';

export class FindUsersQuery extends PaginationQuery {
    constructor(
        page?: number,
        limit?: number,
        public readonly filters?: { name?: string; role?: string }
    ) {
        super(page, limit);
    }
}
