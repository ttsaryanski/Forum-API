import Category from "../models/Category.js";

import { CategoryServicesTypes } from "../types/servicesTypes.js";
import { CategoryResponseType } from "../types/categoryTypes.js";

import { CustomError } from "../utils/errorUtils/customError.js";

export const categoryService: CategoryServicesTypes = {
    async getAll(): Promise<CategoryResponseType[]> {
        const categories = await Category.findAll();
        if (!categories || categories.length === 0) {
            throw new CustomError("Categories not found", 404);
        }

        return categories.map((category) => ({
            id: category.id!.toString(),
            name: category.name,
        }));
    },
};
