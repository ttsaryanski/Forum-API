import { Router, Request, Response } from "express";

import { CategoryServicesTypes } from "../types/servicesTypes.js";

import { asyncErrorHandler } from "../utils/errorUtils/asyncErrorHandler.js";
import { CustomError } from "../utils/errorUtils/customError.js";

import { postgressIdSchema } from "../validators/postgressId.schema.js";

export function categoryController(categoryService: CategoryServicesTypes) {
    const router = Router();

    router.get(
        "/limit5",
        asyncErrorHandler(async (req: Request, res: Response) => {
            const categories = await categoryService.getLimit5();

            res.status(200).json(categories);
        })
    );

    router.get(
        "/list",
        asyncErrorHandler(async (req: Request, res: Response) => {
            const categories = await categoryService.getList();

            res.status(200).json(categories);
        })
    );

    router.get(
        "/:id",
        asyncErrorHandler(async (req: Request, res: Response) => {
            const resultId = postgressIdSchema.safeParse(req.params.id);
            if (!resultId.success) {
                throw new CustomError(resultId.error.issues[0].message, 400);
            }

            const category = await categoryService.getById(resultId.data);

            res.status(200).json(category);
        })
    );

    return router;
}
