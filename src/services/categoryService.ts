import Category from "../models/Category.js";

import { CategoryServicesTypes } from "../types/servicesTypes.js";
import { CategoryResponseType } from "../types/categoryTypes.js";

import { CustomError } from "../utils/errorUtils/customError.js";

import Theme from "../models/Theme.js";
import User from "../models/User.js";

export const categoryService: CategoryServicesTypes = {
    async getAll(): Promise<CategoryResponseType[]> {
        const categories = await Category.findAll({
            include: [
                {
                    model: Theme,
                    as: "themes",
                    attributes: [
                        "id",
                        "title",
                        "updatedAt",
                        "author_id",
                        "category_id",
                    ],
                    limit: 5,
                    order: [["updatedAt", "DESC"]],
                    include: [
                        {
                            model: User,
                            as: "author",
                            attributes: ["username"],
                        },
                    ],
                },
            ],
            group: ["Category.id"],
        });

        if (!categories || categories.length === 0) {
            throw new CustomError("Categories not found", 404);
        }

        return categories.map((category) => ({
            id: category.id!.toString(),
            name: category.name,
            themes: category.themes?.map((theme) => ({
                id: theme.id,
                title: theme.title,
                updatedAt: theme.updatedAt,
                author_name: theme.author?.username || "Unknown",
            })),
        }));
    },
};
