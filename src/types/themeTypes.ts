export interface LastFiveThemesResponseType {
    id: string;
    title: string;
    content: string;
    updatedAt: Date;
    author_name?: string;
    category_id?: string;
    category_name?: string;
}

export interface ThemeWithDetailsResponseType {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    author_name?: string;
    category_name?: string;
    comments_content?: {}[];
}

export interface PaginatedThemeResponseType {
    data: ThemeWithDetailsResponseType;
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}
