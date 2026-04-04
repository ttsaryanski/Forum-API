export interface MessageResponseType {
    id: string;
    content: string;
    createdAt?: Date;
    author?: {
        id: number;
        username: string;
        avatar_url: string;
    };
}

export interface PaginatedMessageResponseType {
    data: MessageResponseType[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}
