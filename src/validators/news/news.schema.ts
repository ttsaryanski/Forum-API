import { z } from "zod";

export const createNewsSchema = z.object({
    title: z
        .string()
        .min(3, "News title should be at least 3 characters long!")
        .trim(),
    content: z
        .string()
        .min(3, "News content should be at least 3 characters long!"),
});

export type CreateNewsDataType = z.infer<typeof createNewsSchema>;
