import { NewsResponseType } from "./NewsTypes.js";
import { CreateNewsDataType } from "../validators/news/news.schema.js";

import { UserResponseType } from "./UserTypes.js";
import {
    RegisterUserDataType,
    LoginUserDataType,
} from "../validators/user.schema.js";

export interface NewsServicesTypes {
    getAll(): Promise<NewsResponseType[]>;
    create(data: CreateNewsDataType): Promise<NewsResponseType>;
    edit(newsId: string, data: CreateNewsDataType): Promise<NewsResponseType>;
    remove(newsId: string): Promise<void>;
    getById(newsId: string): Promise<NewsResponseType>;
}

export interface AuthServicesTypes {
    register(
        data: RegisterUserDataType
    ): Promise<{ accessToken: string; refreshToken: string }>;
    login(
        data: LoginUserDataType
    ): Promise<{ accessToken: string; refreshToken: string }>;
    logout(token: { accessToken: string; refreshToken: string }): Promise<void>;
    getUserById(id: string): Promise<UserResponseType>;
}

export interface GCSServiceTypes {
    uploadFile(file: Express.Multer.File): Promise<string>;
    deleteFile(filePath: string): Promise<void>;
}
