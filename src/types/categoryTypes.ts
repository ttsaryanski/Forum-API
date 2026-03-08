export interface CategoryResponseType {
    id: string;
    name: string;
    themes?: {}[];
}

export interface CategoryListResponseType {
    id: string;
    name: string;
}

export interface PaginatedCategoryResponse {
    data: CategoryResponseType;
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}
