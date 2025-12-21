import { z } from "zod";
import { postgressIdSchema } from "./postgressId.schema.js";

export const createThemeSchema = z.object({
    categoryId: postgressIdSchema,
    title: z
        .string()
        .min(5, "Title should be at least 5 characters long!")
        .trim(),
    content: z
        .string()
        .min(10, "Content should be at least 10 characters long!")
        .trim(),
});
export type CreateThemeDataType = z.infer<typeof createThemeSchema>;
