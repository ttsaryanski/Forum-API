import { Router, Request, Response } from "express";

import { CategoryServicesTypes } from "../types/servicesTypes.js";

import { asyncErrorHandler } from "../utils/errorUtils/asyncErrorHandler.js";
import { CustomError } from "../utils/errorUtils/customError.js";

export function categoryController(categoryService: CategoryServicesTypes) {
    const router = Router();

    router.get(
        "/",
        asyncErrorHandler(async (req: Request, res: Response) => {
            const categories = await categoryService.getAll();

            res.status(200).json(categories);
        })
    );

    return router;
}
