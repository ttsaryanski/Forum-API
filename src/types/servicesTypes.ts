import { NewsResponseType } from "./newsTypes.js";
import { CreateNewsDataType } from "../validators/news/news.schema.js";

import { UserResponseType } from "./userTypes.js";
import {
    RegisterUserDataType,
    LoginUserDataType,
    ChangePasswordDataType,
    EditUserDataType,
    EmailDataType,
    NewPasswordDataType,
} from "../validators/user.schema.js";

import {
    CategoryResponseType,
    CategoryListResponseType,
    PaginatedCategoryResponse,
} from "./categoryTypes.js";

import {
    LastFiveThemesResponseType,
    ThemeWithDetailsResponseType,
    PaginatedThemeResponseType,
} from "./themeTypes.js";

import { CreateThemeDataType } from "../validators/theme.schema.js";
import { CreateCommentDataType } from "../validators/comment.schema.js";

import { PaginatedMessageResponseType } from "./messageTypes.js";

export interface NewsServicesTypes {
    getAll(): Promise<NewsResponseType[]>;
    create(data: CreateNewsDataType): Promise<NewsResponseType>;
    edit(newsId: string, data: CreateNewsDataType): Promise<NewsResponseType>;
    remove(newsId: string): Promise<void>;
    getById(newsId: string): Promise<NewsResponseType>;
}

export interface AuthServicesTypes {
    register(data: RegisterUserDataType): Promise<string>;
    login(
        data: LoginUserDataType
    ): Promise<{ accessToken: string; refreshToken: string }>;
    logout(token: { accessToken: string; refreshToken: string }): Promise<void>;
    getUserById(id: string): Promise<UserResponseType>;
    verifyEmail(token: string): Promise<string>;
    resendVerificationEmail(data: EmailDataType): Promise<string>;
    changePassword(
        userId: string,
        data: ChangePasswordDataType
    ): Promise<string>;
    editUser(
        userId: string,
        data: EditUserDataType,
        file?: Express.Multer.File
    ): Promise<UserResponseType>;
    forgotPassword(data: EmailDataType): Promise<string>;
    setNewPassword(token: string, data: NewPasswordDataType): Promise<string>;
}

export interface GCSServiceTypes {
    uploadFile(file: Express.Multer.File): Promise<string>;
    deleteFile(filePath: string): Promise<void>;
}

export interface CategoryServicesTypes {
    getLimit5(): Promise<CategoryResponseType[]>;
    getList(): Promise<CategoryListResponseType[]>;
    getById(categoryId: string): Promise<CategoryResponseType>;
    getByIdPaginated(
        categoryId: string,
        page: number,
        limit: number
    ): Promise<PaginatedCategoryResponse>;
}

export interface ThemeServicesTypes {
    getLastFiveThemes(): Promise<LastFiveThemesResponseType[]>;
    getById(themeId: string): Promise<ThemeWithDetailsResponseType>;
    create(data: CreateThemeDataType, authorId: number): Promise<string>;
    getByIdPaginated(
        themeId: string,
        page: number,
        limit: number
    ): Promise<PaginatedThemeResponseType>;
}

export interface CommentServicesTypes {
    create(data: CreateCommentDataType, authorId: number): Promise<string>;
}

export interface MessageServicesTypes {
    getByCategoryIdPaginated(
        categoryId: string,
        page: number,
        limit: number
    ): Promise<PaginatedMessageResponseType>;
}
