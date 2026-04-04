import Message from "../models/messages.js";
import User from "../models/User.js";

import { MessageServicesTypes } from "../types/servicesTypes.js";
import { PaginatedMessageResponseType } from "../types/messageTypes.js";

import { CustomError } from "../utils/errorUtils/customError.js";

export const messageService: MessageServicesTypes = {
    async getByCategoryIdPaginated(
        categoryId: string,
        page: number,
        limit: number
    ): Promise<PaginatedMessageResponseType> {
        const offset = (page - 1) * limit;

        const { rows: messages, count } = await Message.findAndCountAll({
            where: { category_id: categoryId },
            attributes: ["id", "content", "createdAt"],
            include: [
                {
                    model: User,
                    as: "author",
                    attributes: ["id", "username", "avatar_url"],
                },
            ],
            order: [["createdAt", "ASC"]],
            limit,
            offset,
        });

        if (!messages) {
            throw new CustomError("Messages not found", 404);
        }

        const totalPages = Math.ceil(count / limit);

        return {
            data: messages.map((message) => ({
                id: message.id!.toString(),
                content: message.content,
                createdAt: message.createdAt,
                author: message.author
                    ? {
                          id: message.author.id,
                          username: message.author.username,
                          avatar_url: message.author.avatar_url,
                      }
                    : undefined,
            })),
            pagination: {
                page,
                limit,
                total: count,
                pages: totalPages,
            },
        };
    },
};
