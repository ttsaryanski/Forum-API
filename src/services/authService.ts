import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { signJwt, verifyJwt } from "../lib/jwt.js";

import { gcsService } from "./gcsService.js";

import { CustomError } from "../utils/errorUtils/customError.js";

import User from "../models/User.js";
import RefreshToken from "../models/RefreshToken.js";

import { AuthServicesTypes } from "../types/ServicesTypes.js";
import { UserResponseType } from "../types/UserTypes.js";
import {
    RegisterUserDataType,
    LoginUserDataType,
    ChangePasswordDataType,
    EditUserDataType,
    EmailDataType,
    NewPasswordDataType,
} from "../validators/user.schema.js";

import { isDev } from "../config/expressInit.js";

interface EmailVerificationPayload {
    userId: number;
    type: "email-verification";
    iat?: number;
    exp?: number;
}

interface PasswordResetPayload {
    userId: number;
    type: "password-reset";
    iat?: number;
    exp?: number;
}

const apiUrl = isDev ? "http://localhost:3000" : process.env.API_URL;
const clientUrl = isDev ? "http://localhost:5173" : process.env.CLIENT_URL;

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const authService: AuthServicesTypes = {
    async register(data: RegisterUserDataType): Promise<string> {
        const existingEmail = await User.findOne({
            where: { email: data.email },
        });
        if (existingEmail) {
            throw new CustomError("This email already registered!", 409);
        }
        const existingUserName = await User.findOne({
            where: { username: data.username },
        });
        if (existingUserName) {
            throw new CustomError("This username already registered!", 409);
        }

        const userData = {
            email: data.email,
            password: data.password,
            username: data.username,
            role: "user" as const,
        };

        await User.create(userData);

        const createdUser = await User.findOne({
            where: { email: data.email },
        });
        if (!createdUser) {
            throw new CustomError("Failed to create user!", 500);
        }

        const verificationToken = await signJwt(
            {
                userId: createdUser.id,
                type: "email-verification",
            },
            process.env.JWT_SECRET!,
            { expiresIn: "24h" }
        );

        const verificationLink = `${apiUrl}/api/auth/verify-email/${verificationToken}`;
        try {
            await transporter.sendMail({
                from: `"Forum App" <${process.env.EMAIL_USER}>`,
                to: data.email,
                subject: "Confirm your email address",
                html: `<p>Hello ${data.username},</p>
                <p>Please click the link below to verify your email:</p>
                <a href="${verificationLink}">${verificationLink}</a>
                <p><strong>This link will expire in 24 hours.</strong></p>`,
            });
        } catch (error) {
            throw new CustomError(
                `Failed to send verification email!: ${error}`,
                500
            );
        }

        return "Registration successful. Please check your email to verify your account!";
    },

    async login(
        data: LoginUserDataType
    ): Promise<{ accessToken: string; refreshToken: string }> {
        const user = await User.findOne({
            where: { email: data.email },
        });

        if (!user) {
            throw new CustomError("User does not exist!", 404);
        }

        if (!user.isVerified) {
            throw new CustomError("Please verify your email first!", 403);
        }

        const isValid = await bcrypt.compare(data.password, user.password);

        if (!isValid) {
            throw new CustomError("Password does not match!", 401);
        }

        await user.update({ last_login: new Date() }, { silent: true });

        return createAccessTokens({
            id: user.id!.toString(),
            email: user.email,
            username: user.username,
            role: user.role,
        });
    },

    async logout(token: {
        refreshToken: string;
        accessToken: string;
    }): Promise<void> {
        await RefreshToken.destroy({
            where: { token: token.refreshToken },
        });
    },

    async getUserById(id: string): Promise<UserResponseType> {
        const user = await User.findByPk(parseInt(id), {
            attributes: { exclude: ["password"] },
        });

        if (!user) {
            throw new CustomError("There is no user with this id!", 404);
        }

        return {
            id: user.id!.toString(),
            email: user.email,
            username: user.username,
            avatarUrl: user.avatar_url || undefined,
            lastLogin: user.last_login || undefined,
            role: user.role,
            createdAt: user.createdAt!,
            updatedAt: user.updatedAt!,
        };
    },

    async editUser(
        userId: string,
        data: EditUserDataType,
        file?: Express.Multer.File
    ): Promise<UserResponseType> {
        const user = await User.findByPk(parseInt(userId));
        if (!user) {
            throw new CustomError("User not found!", 404);
        }

        if (data.username) {
            const existingUserName = await User.findOne({
                where: { username: data.username },
            });
            if (existingUserName && existingUserName.id !== user.id) {
                throw new CustomError("This username is already taken!", 409);
            }
            user.username = data.username;
        }

        if (file) {
            const avatarUrl = await gcsService.uploadFile(file);
            user.avatar_url = avatarUrl;
        }

        await user.save();

        return {
            id: user.id!.toString(),
            email: user.email,
            username: user.username,
            avatarUrl: user.avatar_url || undefined,
            lastLogin: user.last_login || undefined,
            role: user.role,
            createdAt: user.createdAt!,
            updatedAt: user.updatedAt!,
        };
    },

    async verifyEmail(token: string): Promise<string> {
        try {
            const decoded = (await verifyJwt(
                token,
                process.env.JWT_SECRET!
            )) as EmailVerificationPayload;

            if (decoded.type !== "email-verification") {
                throw new CustomError("Invalid token type!", 400);
            }

            const user = await User.findByPk(decoded.userId);

            if (!user) {
                throw new CustomError("User not found!", 404);
            }

            if (user.isVerified) {
                throw new CustomError("Email is already verified!", 400);
            }

            user.isVerified = true;
            await user.save();

            return "Email verified successfully!";
        } catch (error: unknown) {
            if (error instanceof Error && error.name === "TokenExpiredError") {
                throw new CustomError(
                    "Verification token has expired. Please request a new verification email.",
                    401
                );
            }
            if (error instanceof Error && error.name === "JsonWebTokenError") {
                throw new CustomError("Invalid verification token!", 401);
            }
            throw error;
        }
    },

    async resendVerificationEmail(data: EmailDataType): Promise<string> {
        const user = await User.findOne({
            where: { email: data.email },
        });

        if (!user) {
            throw new CustomError("User with this email does not exist!", 404);
        }

        if (user.isVerified) {
            throw new CustomError("Email is already verified!", 400);
        }
        const verificationToken = await signJwt(
            {
                userId: user.id,
                type: "email-verification",
            },
            process.env.JWT_SECRET!,
            { expiresIn: "24h" }
        );

        const verificationLink = `${apiUrl}/api/auth/verify-email/${verificationToken}`;
        try {
            await transporter.sendMail({
                from: `"Forum App" <${process.env.EMAIL_USER}>`,
                to: data.email,
                subject: "Confirm your email address",
                html: `<p>Hello ${user.username},</p>
                <p>Please click the link below to verify your email:</p>
                <a href="${verificationLink}">${verificationLink}</a>
                <p><strong>This link will expire in 24 hours.</strong></p>`,
            });
        } catch (error) {
            throw new CustomError(
                `Failed to send verification email!: ${error}`,
                500
            );
        }

        return "Verification email resent. Please check your inbox.";
    },

    async forgotPassword(data: EmailDataType): Promise<string> {
        const user = await User.findOne({
            where: { email: data.email },
        });

        if (!user) {
            throw new CustomError("User with this email does not exist!", 404);
        }

        const resetToken = await signJwt(
            {
                userId: user.id,
                type: "password-reset",
            },
            process.env.JWT_SECRET!,
            { expiresIn: "15m" }
        );

        const verificationLink = `${clientUrl}/auth/resetPassword/${resetToken}`;
        try {
            await transporter.sendMail({
                from: `"Forum App" <${process.env.EMAIL_USER}>`,
                to: data.email,
                subject: "Reset your password",
                html: `<p>Hello,</p>
                <p>Please click the link below to reset your password:</p>
                <a href="${verificationLink}">${verificationLink}</a>
                <p><strong>This link will expire in 15 minutes.</strong></p>`,
            });
        } catch (error) {
            throw new CustomError(
                `Failed to send password reset email!: ${error}`,
                500
            );
        }

        return "Verification email sent. Please check your inbox.";
    },

    async changePassword(
        userId: string,
        data: ChangePasswordDataType
    ): Promise<string> {
        const user = await User.findByPk(parseInt(userId));
        if (!user) {
            throw new CustomError("User not found!", 404);
        }

        const isValid = await bcrypt.compare(
            data.currentPassword,
            user.password
        );
        if (!isValid) {
            throw new CustomError("Current password is incorrect!", 401);
        }

        user.password = data.newPassword;
        await user.save();

        return "Password changed successfully!";
    },

    async setNewPassword(
        token: string,
        data: NewPasswordDataType
    ): Promise<string> {
        try {
            const decoded = (await verifyJwt(
                token,
                process.env.JWT_SECRET!
            )) as PasswordResetPayload;

            if (decoded.type !== "password-reset") {
                throw new CustomError("Invalid token type!", 400);
            }

            const user = await User.findByPk(decoded.userId);

            if (!user) {
                throw new CustomError(
                    "No user found to set a new password!",
                    404
                );
            }

            user.password = data.password;
            await user.save();
            await RefreshToken.destroy({ where: { user_id: user.id } });

            return "New password set successfully!";
        } catch (error: unknown) {
            if (error instanceof Error && error.name === "TokenExpiredError") {
                throw new CustomError(
                    "Password reset token has expired. Please request a new password reset.",
                    401
                );
            }
            if (error instanceof Error && error.name === "JsonWebTokenError") {
                throw new CustomError("Invalid password reset token!", 401);
            }
            throw error;
        }
    },
};

export type AccessTokenUser = {
    id: string;
    email: string;
    username: string;
    role: string;
};

export async function createAccessTokens(user: AccessTokenUser) {
    if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
        throw new CustomError("JWT secret is not configured!", 500);
    }

    const payload = {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
    };

    const accessToken = await signJwt(payload, process.env.JWT_SECRET, {
        expiresIn: "15m",
    });

    const refreshToken = await signJwt(
        payload,
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn: "7d",
        }
    );

    await RefreshToken.create({
        token: refreshToken,
        user_id: parseInt(user.id),
    });

    return { accessToken, refreshToken };
}
