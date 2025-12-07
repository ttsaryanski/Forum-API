export interface LastFiveThemesResponseType {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    author_id: string;
    author_name?: string;
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
