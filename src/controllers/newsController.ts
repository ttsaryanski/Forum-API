import { Router, Request, Response } from "express";

import { NewsServicesTypes } from "../types/servicesTypes.js";

import { asyncErrorHandler } from "../utils/errorUtils/asyncErrorHandler.js";
import { CustomError } from "../utils/errorUtils/customError.js";

import { createNewsSchema } from "../validators/news/news.schema.js";
import { mongooseIdSchema } from "../validators/mongooseId.schema.js";

export function newsController(newsService: NewsServicesTypes) {
    const router = Router();

    router.get(
        "/",
        asyncErrorHandler(async (req: Request, res: Response) => {
            const news = await newsService.getAll();
            res.status(200).json(news);
        })
    );

    router.post(
        "/",
        asyncErrorHandler(async (req: Request, res: Response) => {
            const resultData = createNewsSchema.safeParse(req.body);

            if (!resultData.success) {
                throw new CustomError(resultData.error.issues[0].message, 400);
            }

            const item = await newsService.create(resultData.data);
            res.status(201).json(item);
        })
    );

    router.put(
        "/:newsId",
        asyncErrorHandler(async (req, res) => {
            const resultId = mongooseIdSchema.safeParse(req.params.newsId);
            if (!resultId.success) {
                throw new CustomError(resultId.error.issues[0].message, 400);
            }

            const resultData = createNewsSchema.safeParse(req.body);
            if (!resultData.success) {
                throw new CustomError(resultData.error.issues[0].message, 400);
            }

            const item = await newsService.edit(resultId.data, resultData.data);

            res.status(200).json(item);
        })
    );

    router.delete(
        "/:newsId",
        asyncErrorHandler(async (req, res) => {
            const resultId = mongooseIdSchema.safeParse(req.params.newsId);
            if (!resultId.success) {
                throw new CustomError(resultId.error.issues[0].message, 400);
            }

            await newsService.remove(resultId.data);

            res.status(204).end();
        })
    );

    router.get(
        "/:newsId",
        asyncErrorHandler(async (req, res) => {
            const resultId = mongooseIdSchema.safeParse(req.params.newsId);
            if (!resultId.success) {
                throw new CustomError(resultId.error.issues[0].message, 400);
            }

            const item = await newsService.getById(resultId.data);

            res.status(200).send(item);
        })
    );

    return router;
}
