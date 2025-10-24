import { z } from "zod";

export const registerUserSchema = z.object({
    email: z.string().email("Invalid email format!").trim(),
    password: z
        .string()
        .min(6, "Password should be at least 6 characters long!"),
    username: z
        .string()
        .min(3, "Username should be at least 3 characters long!")
        .trim(),
});
export type RegisterUserDataType = z.infer<typeof registerUserSchema>;

export const loginUserSchema = z.object({
    email: z.string().email("Invalid email format!").trim(),
    password: z
        .string()
        .min(6, "Password should be at least 6 characters long!"),
});
export type LoginUserDataType = z.infer<typeof loginUserSchema>;
