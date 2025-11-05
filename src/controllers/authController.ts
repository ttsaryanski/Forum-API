import { Router, Response } from "express";

import { authMiddleware } from "../middlewares/authMiddleware.js";

import { AuthServicesTypes } from "../types/ServicesTypes.js";
import { RequestUser } from "../types/express.js";

import { asyncErrorHandler } from "../utils/errorUtils/asyncErrorHandler.js";
import { CustomError } from "../utils/errorUtils/customError.js";
import { createAccessTokens } from "../services/authService.js";
import { loginLimiter } from "../utils/rateLimiter.js";

import {
    registerUserSchema,
    loginUserSchema,
    changePasswordSchema,
    editUserSchema,
    emailSchema,
    newPasswordSchema,
} from "../validators/user.schema.js";

import upload from "../utils/upload/multerStorage.js";
import { isDev } from "../config/expressInit.js";
const clientUrl = isDev
    ? "http://localhost:5173"
    : "https://forum-1ab65.web.app";

export function authController(authService: AuthServicesTypes) {
    const router = Router();

    router.post(
        "/register",
        asyncErrorHandler(async (req, res: Response) => {
            const resultData = registerUserSchema.safeParse(req.body);
            if (!resultData.success) {
                throw new CustomError(resultData.error.issues[0].message, 400);
            }

            const message = await authService.register(resultData.data);

            res.status(201).json({ message });
        })
    );

    router.post(
        "/login",
        loginLimiter,
        asyncErrorHandler(async (req, res: Response) => {
            const resultData = loginUserSchema.safeParse(req.body);
            if (!resultData.success) {
                throw new CustomError(resultData.error.issues[0].message, 400);
            }

            const tokens = await authService.login(resultData.data);

            res.status(201)
                .cookie("refreshToken", tokens.refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                })
                .json({ accessToken: tokens.accessToken });
        })
    );

    router.post(
        "/logout",
        authMiddleware,
        asyncErrorHandler(async (req, res: Response) => {
            const refreshToken = req.cookies?.refreshToken;
            if (!refreshToken) {
                throw new CustomError("No refresh token provided!", 401);
            }

            await authService.logout({ refreshToken, accessToken: "" });

            res.status(200)
                .clearCookie("refreshToken", {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                })
                .json({ message: "Logged out successfully!" });
        })
    );

    router.get(
        "/profile",
        authMiddleware,
        asyncErrorHandler(async (req, res: Response) => {
            const userId = req.user?.id;
            if (!userId) {
                throw new CustomError("Unauthorized!", 401);
            }

            const user = await authService.getUserById(userId);

            res.status(200).json(user);
        })
    );

    router.put(
        "/profile",
        authMiddleware,
        upload.single("file"),
        asyncErrorHandler(async (req, res) => {
            const userId = req.user!.id;
            let file = null;
            let data = req.body;

            if (req.file) {
                file = req.file;
                data = { ...data, file: req.file };
            }

            const resultData = editUserSchema.safeParse(data);
            if (!resultData.success) {
                throw new CustomError(resultData.error.issues[0].message, 400);
            }

            const updatedUser = await authService.editUser(
                userId,
                data,
                file || undefined
            );

            res.status(201).json(updatedUser);
        })
    );

    router.post(
        "/refresh",
        authMiddleware,
        asyncErrorHandler(async (req, res) => {
            const user = req.user as RequestUser;

            const tokens = await createAccessTokens({
                id: user.id,
                email: user.email,
                username: user.username,
                role: user.role,
            });

            res.status(200).json({ accessToken: tokens.accessToken });
        })
    );

    router.get(
        "/verify-email/:token",
        asyncErrorHandler(async (req, res) => {
            const token = req.params.token;
            if (!token) {
                throw new CustomError("Verification token is required!", 400);
            }
            await authService.verifyEmail(token);

            res.status(200).redirect(`${clientUrl}/auth/verified`);
        })
    );

    router.post(
        "/resend-email",
        asyncErrorHandler(async (req, res) => {
            const email = req.query.email as string;
            if (!email) {
                throw new CustomError("Email is required!", 400);
            }

            const message = await authService.resendVerificationEmail(email);

            res.status(200).json({ message });
        })
    );

    router.post(
        "/forgot-password",
        asyncErrorHandler(async (req, res) => {
            const resultData = emailSchema.safeParse(req.body);
            if (!resultData.success) {
                throw new CustomError(resultData.error.issues[0].message, 400);
            }

            const message = await authService.forgotPassword(resultData.data);

            res.status(200).json({ message });
        })
    );

    router.post(
        "/change-password",
        authMiddleware,
        asyncErrorHandler(async (req, res: Response) => {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: "Unauthorized!" });
                return;
            }

            const resultData = changePasswordSchema.safeParse(req.body);
            if (!resultData.success) {
                throw new CustomError(resultData.error.issues[0].message, 400);
            }

            const message = await authService.changePassword(
                userId,
                resultData.data
            );

            res.status(200).json({ message });
        })
    );

    router.post(
        "/reset-password",
        asyncErrorHandler(async (req, res: Response) => {
            const token = req.query.token as string;
            if (!token) {
                throw new CustomError("Token is required!", 400);
            }

            const resultData = newPasswordSchema.safeParse(req.body);
            if (!resultData.success) {
                throw new CustomError(resultData.error.issues[0].message, 400);
            }

            const message = await authService.setNewPassword(
                token,
                resultData.data
            );

            res.status(200).json({ message });
        })
    );

    return router;
}
