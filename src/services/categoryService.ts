import Category from "../models/Category.js";

import { CategoryServicesTypes } from "../types/servicesTypes.js";
import {
    CategoryResponseType,
    CategoryListResponseType,
    PaginatedCategoryResponse,
} from "../types/categoryTypes.js";

import { CustomError } from "../utils/errorUtils/customError.js";

import Theme from "../models/Theme.js";
import User from "../models/User.js";

export const categoryService: CategoryServicesTypes = {
    async getLimit5(): Promise<CategoryResponseType[]> {
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

    async getById(categoryId: string): Promise<CategoryResponseType> {
        const category = await Category.findByPk(categoryId, {
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
            order: [[{ model: Theme, as: "themes" }, "updatedAt", "DESC"]],
        });

        if (!category) {
            throw new CustomError("Category not found", 404);
        }

        return {
            id: category.id!.toString(),
            name: category.name,
            themes: category.themes?.map((theme) => ({
                id: theme.id,
                title: theme.title,
                updatedAt: theme.updatedAt,
                author_name: theme.author?.username || "Unknown",
            })),
        };
    },

    async getList(): Promise<CategoryListResponseType[]> {
        const categories = await Category.findAll();

        if (!categories || categories.length === 0) {
            throw new CustomError("Categories not found", 404);
        }

        return categories.map((category) => ({
            id: category.id!.toString(),
            name: category.name,
        }));
    },

    async getByIdPaginated(
        categoryId: string,
        page: number,
        limit: number
    ): Promise<PaginatedCategoryResponse> {
        const offset = (page - 1) * limit;

        const category = await Category.findByPk(categoryId, {
            attributes: ["id", "name"],
        });
        if (!category) {
            throw new CustomError("Category not found", 404);
        }

        const { rows: themes, count: totalThemes } =
            await Theme.findAndCountAll({
                where: { category_id: categoryId },
                attributes: ["id", "title", "updatedAt", "author_id"],
                include: [
                    {
                        model: User,
                        as: "author",
                        attributes: ["username"],
                    },
                ],
                order: [["updatedAt", "DESC"]],
                limit,
                offset,
            });
        const totalPages = Math.ceil(totalThemes / limit);

        return {
            data: {
                id: category.id!.toString(),
                name: category.name,
                themes: themes?.map((theme) => ({
                    id: theme.id,
                    title: theme.title,
                    updatedAt: theme.updatedAt,
                    author_name: theme.author?.username || "Unknown",
                })),
            },
            pagination: {
                page,
                limit,
                total: totalThemes,
                pages: totalPages,
            },
        };
    },
};
