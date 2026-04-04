import { Router, Request, Response } from "express";

import { MessageServicesTypes } from "../types/servicesTypes.js";

import { asyncErrorHandler } from "../utils/errorUtils/asyncErrorHandler.js";
import { CustomError } from "../utils/errorUtils/customError.js";

export function messageController(messageService: MessageServicesTypes) {
    const router = Router();

    router.get(
        "/paginated",
        asyncErrorHandler(async (req: Request, res: Response) => {
            const categoryId =
                parseInt(req.query.roomId as string) || undefined;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 50;

            if (!categoryId) {
                throw new CustomError("Category ID is required", 400);
            }

            const messages = await messageService.getByCategoryIdPaginated(
                categoryId.toString(),
                page,
                limit
            );

            res.status(200).json(messages);
        })
    );

    return router;
}
