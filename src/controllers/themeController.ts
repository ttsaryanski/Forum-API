import { Router, Request, Response } from "express";

import { ThemeServicesTypes } from "../types/servicesTypes.js";

import { asyncErrorHandler } from "../utils/errorUtils/asyncErrorHandler.js";
import { CustomError } from "../utils/errorUtils/customError.js";

import { postgressIdSchema } from "../validators/postgressId.schema.js";

export function themeController(themeService: ThemeServicesTypes) {
    const router = Router();

    router.get(
        "/last-five",
        asyncErrorHandler(async (req: Request, res: Response) => {
            const themes = await themeService.getLastFiveThemes();

            res.status(200).json(themes);
        })
    );

    router.get(
        "/:id",
        asyncErrorHandler(async (req: Request, res: Response) => {
            const resultId = postgressIdSchema.safeParse(req.params.id);
            if (!resultId.success) {
                throw new CustomError(resultId.error.issues[0].message, 400);
            }

            const theme = await themeService.getById(resultId.data);

            res.status(200).json(theme);
        })
    );

    return router;
}
