export class dropdown {
    constructor(
        public value: string,
        public text: string,
        public id: string
    ) { }
}

export interface Pagination {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
}

export class PaginatedResult<T>{
    resut: T;
    pagination: Pagination;
}
