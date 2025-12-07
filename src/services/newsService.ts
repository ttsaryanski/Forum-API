import { News } from "../models/News.js";

import { NewsServicesTypes } from "../types/servicesTypes.js";
import { NewsResponseType } from "../types/newsTypes.js";
import { CreateNewsDataType } from "../validators/news/news.schema.js";

import { CustomError } from "../utils/errorUtils/customError.js";

export const newsService: NewsServicesTypes = {
    async getAll(): Promise<NewsResponseType[]> {
        const news = await News.find().select("-__v").limit(5).lean();

        return news.map((item) => ({
            _id: item._id.toString(),
            title: item.title,
            content: item.content,
            createdAt: item.createdAt,
        }));
    },

    async create(data: CreateNewsDataType): Promise<NewsResponseType> {
        const newNews = (await News.create(data)) as NewsResponseType;
        return {
            _id: newNews._id.toString(),
            title: newNews.title,
            content: newNews.content,
            createdAt: newNews.createdAt,
        };
    },

    async edit(
        newsId: string,
        data: CreateNewsDataType
    ): Promise<NewsResponseType> {
        const updatedNews = (await News.findByIdAndUpdate(newsId, data, {
            runValidators: true,
            new: true,
        })) as NewsResponseType;

        if (!updatedNews) {
            throw new CustomError("News not found!", 404);
        }
        return {
            _id: updatedNews._id.toString(),
            title: updatedNews.title,
            content: updatedNews.content,
            createdAt: updatedNews.createdAt,
        };
    },

    async remove(newsId: string): Promise<void> {
        const result = await News.findByIdAndDelete(newsId);

        if (!result) {
            throw new CustomError("News not found!", 404);
        }
    },

    async getById(newsId: string): Promise<NewsResponseType> {
        const news = (await News.findById(newsId)) as NewsResponseType;

        if (!news) {
            throw new CustomError("There is no news with this id!", 404);
        }

        return {
            _id: news._id.toString(),
            title: news.title,
            content: news.content,
            createdAt: news.createdAt,
        };
    },
};
