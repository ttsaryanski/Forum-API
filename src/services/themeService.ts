import sequelize from "sequelize";

import Theme from "../models/Theme.js";
import User from "../models/User.js";
import Category from "../models/Category.js";
import Comment from "../models/Comment.js";
import Like from "../models/Like.js";

import { ThemeServicesTypes } from "../types/servicesTypes.js";
import {
    LastFiveThemesResponseType,
    ThemeWithDetailsResponseType,
} from "../types/themeTypes.js";

import { CustomError } from "../utils/errorUtils/customError.js";

export const themeService: ThemeServicesTypes = {
    async getLastFiveThemes(): Promise<LastFiveThemesResponseType[]> {
        const themes = await Theme.findAll({
            order: [["updatedAt", "DESC"]],
            limit: 5,
            include: [
                {
                    model: User,
                    as: "author",
                    attributes: ["username"],
                },
                { model: Category, as: "category", attributes: ["name"] },
            ],
        });

        if (!themes || themes.length === 0) {
            throw new CustomError("Themes not found", 404);
        }

        return themes.map((theme) => ({
            id: theme.id!.toString(),
            title: theme.title,
            content: theme.content,
            updatedAt: theme.updatedAt!,
            author_name: (theme.get("author") as { username: string }).username,
            category_name: (theme.get("category") as { name: string }).name,
        }));
    },

    async getById(themeId: string): Promise<ThemeWithDetailsResponseType> {
        const theme = await Theme.findByPk(themeId, {
            include: [
                {
                    model: User,
                    as: "author",
                    attributes: ["username"],
                },
                {
                    model: Category,
                    as: "category",
                    attributes: ["name"],
                },
                {
                    model: Comment,
                    as: "Comments",
                    attributes: [
                        "id",
                        "content",
                        "createdAt",
                        "updatedAt",
                        "is_edited",
                        [
                            sequelize.fn(
                                "COUNT",
                                sequelize.col("Comments->likes.id")
                            ),
                            "likesCount",
                        ],
                    ],
                    include: [
                        {
                            model: User,
                            as: "author",
                            attributes: ["username", "avatar_url"],
                        },
                        {
                            model: Like,
                            as: "likes",
                            attributes: [],
                        },
                    ],
                },
            ],
            group: [
                "Theme.id",
                "author.id",
                "category.id",
                "Comments.id",
                "Comments->author.id",
            ],
            order: [["Comments", "createdAt", "ASC"]],
        });

        if (!theme) {
            throw new CustomError("Theme not found", 404);
        }

        return {
            id: (theme.id || 0).toString(),
            title: theme.title,
            content: theme.content,
            createdAt: theme.createdAt!,
            updatedAt: theme.updatedAt!,
            author_name: theme.author?.username,
            category_name: theme.category?.name,
            comments_content:
                (theme.get("Comments") as Array<{ content: string }>) || [],
        };
    },
};
