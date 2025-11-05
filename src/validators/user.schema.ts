import { z } from "zod";

import { uploadConfig } from "../utils/upload/uploadConfig.js";

export const registerUserSchema = z.object({
    username: z
        .string()
        .min(3, "Username should be at least 3 characters long!")
        .trim(),
    email: z.string().email("Invalid email format!").trim(),
    password: z
        .string()
        .min(6, "Password should be at least 6 characters long!"),
});
export type RegisterUserDataType = z.infer<typeof registerUserSchema>;

export const loginUserSchema = z.object({
    email: z.string().email("Invalid email format!").trim(),
    password: z
        .string()
        .min(6, "Password should be at least 6 characters long!"),
});
export type LoginUserDataType = z.infer<typeof loginUserSchema>;

export const changePasswordSchema = z.object({
    currentPassword: z
        .string()
        .min(6, "Current password should be at least 6 characters long!"),
    newPassword: z
        .string()
        .min(6, "New password should be at least 6 characters long!"),
});
export type ChangePasswordDataType = z.infer<typeof changePasswordSchema>;

export const editUserSchema = z.object({
    username: z
        .string()
        .min(3, "Username should be at least 3 characters long!")
        .trim(),
    email: z.string().email("Invalid email format!").trim(),
    file: z
        .object({
            mimetype: z.enum(
                uploadConfig.allowedMimeTypes as [string, ...string[]]
            ),
            size: z.number().max(uploadConfig.maxFileSize, {
                message: `File size should not exceed ${uploadConfig.maxFileSize / 1024 / 1024}MB!`,
            }),
            buffer: z.instanceof(Buffer),
            originalname: z.string(),
        })
        .optional(),
});
export type EditUserDataType = z.infer<typeof editUserSchema>;

export const emailSchema = z.object({
    email: z.string().email("Invalid email format!").trim(),
});
export type EmailDataType = z.infer<typeof emailSchema>;

export const newPasswordSchema = z.object({
    password: z
        .string()
        .min(6, "Password should be at least 6 characters long!"),
});
export type NewPasswordDataType = z.infer<typeof newPasswordSchema>;
