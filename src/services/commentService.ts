import Comment from "../models/Comment.js";

import { CommentServicesTypes } from "../types/servicesTypes.js";
import { CreateCommentDataType } from "../validators/comment.schema.js";

import { CustomError } from "../utils/errorUtils/customError.js";

export const commentService: CommentServicesTypes = {
    async create(
        data: CreateCommentDataType,
        authorId: number
    ): Promise<string> {
        const id = Number(data.themeId);
        const newComment = await Comment.create({
            theme_id: id,
            content: data.content,
            author_id: authorId,
        });

        if (!newComment) {
            throw new CustomError("Failed to create comment", 500);
        }

        return newComment.id!.toString();
    },
};
