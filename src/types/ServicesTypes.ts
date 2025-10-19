import { NewsResponseType } from "./NewsTypes.js";
import { CreateNewsDataType } from "../validators/news/news.schema.js";

// import { UserResponseType } from "./UserTypes.js";

export interface NewsServicesTypes {
    getAll(): Promise<NewsResponseType[]>;
    create(data: CreateNewsDataType): Promise<NewsResponseType>;
    edit(newsId: string, data: CreateNewsDataType): Promise<NewsResponseType>;
    remove(newsId: string): Promise<void>;
    getById(newsId: string): Promise<NewsResponseType>;
}

// export interface AuthServicesTypes {
//     register(data: CreateUserDataType): Promise<string>;
//     login(data: CreateUserDataType): Promise<string>;
//     logout(): Promise<void>;
//     getUserById(): Promise<UserResponseType>;
// }
