import { z } from "zod";

export const postgressIdSchema = z.coerce
    .string()
    .regex(/^\d+$/, "Id must be a valid PostgresDB id!");
export type PostgressIdType = z.infer<typeof postgressIdSchema>;
