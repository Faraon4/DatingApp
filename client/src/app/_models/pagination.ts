export interface Pagination {
    // all proprties need to match the same names as in the custom header
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
}


export class PaginatedResult<T> {
    result!: T; // For initial example , T is an array of members
    pagination!: Pagination;
}