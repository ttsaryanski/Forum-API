import { z } from "zod";
import { postgressIdSchema } from "./postgressId.schema.js";

export const createCommentSchema = z.object({
    themeId: postgressIdSchema,
    content: z
        .string()
        .min(10, "Comment should be at least 10 characters long!")
        .trim(),
});
export type CreateCommentDataType = z.infer<typeof createCommentSchema>;
