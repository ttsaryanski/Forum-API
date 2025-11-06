import { NewsResponseType } from "./NewsTypes.js";
import { CreateNewsDataType } from "../validators/news/news.schema.js";

import { UserResponseType } from "./UserTypes.js";
import {
    RegisterUserDataType,
    LoginUserDataType,
    ChangePasswordDataType,
    EditUserDataType,
    EmailDataType,
    NewPasswordDataType,
} from "../validators/user.schema.js";

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
