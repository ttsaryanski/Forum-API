import { z } from "zod";

export const postgressIdSchema = z.string().refine(
    (val) => {
        return /^\d+$/.test(val);
    },
    {
        message: "Id must be a valid PostgressDB id!",
    }
);
export type PostgressIdType = z.infer<typeof postgressIdSchema>;
