import { Router, Request, Response } from "express";

import { authMiddleware } from "../middlewares/authMiddleware.js";

import { CommentServicesTypes } from "../types/servicesTypes.js";

import { asyncErrorHandler } from "../utils/errorUtils/asyncErrorHandler.js";
import { CustomError } from "../utils/errorUtils/customError.js";

import { createCommentSchema } from "../validators/comment.schema.js";

export function commentController(commentService: CommentServicesTypes) {
    const router = Router();

    router.post(
        "/",
        authMiddleware,
        asyncErrorHandler(async (req: Request, res: Response) => {
            const userId = req.user?.id;
            if (!userId) {
                throw new CustomError("Unauthorized!", 401);
            }

            const resultData = createCommentSchema.safeParse(req.body);
            if (!resultData.success) {
                throw new CustomError(resultData.error.issues[0].message, 400);
            }

            const commentId = await commentService.create(
                resultData.data,
                Number(userId)
            );

            res.status(201).json({ commentId });
        })
    );

    return router;
}
