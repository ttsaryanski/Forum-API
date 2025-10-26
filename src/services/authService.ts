import bcrypt from "bcrypt";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { signJwt } from "../lib/jwt.js";

import { gcsService } from "./gcsService.js";

import { CustomError } from "../utils/errorUtils/customError.js";

import User from "../models/User.js";
import RefreshToken from "../models/RefreshToken.js";

import { AuthServicesTypes } from "../types/ServicesTypes.js";
import { UserResponseType } from "../types/UserTypes.js";
import {
    RegisterUserDataType,
    LoginUserDataType,
} from "../validators/user.schema.js";

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

        const token = crypto.randomBytes(32).toString("hex");
        await User.update(
            { verificationToken: token },
            { where: { email: data.email } }
        );

        const verificationLink = `${process.env.CLIENT_URL}/api/auth/verify-email/${token}`;
        await transporter.sendMail({
            from: `"Forum App" <${process.env.EMAIL_USER}>`,
            to: data.email,
            subject: "Confirm your email address",
            html: `<p>Hello ${data.username},</p>
         <p>Please click the link below to verify your email:</p>
         <a href="${verificationLink}">${verificationLink}</a>`,
        });

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

    async verifyEmail(token: string): Promise<string> {
        const user = await User.findOne({
            where: { verificationToken: token },
        });

        if (!user) {
            throw new CustomError("Invalid verification token!", 400);
        }

        user.isVerified = true;
        user.verificationToken = null;
        await user.save();

        return "Email verified successfully!";
    },

    async resendVerificationEmail(email: string): Promise<string> {
        const user = await User.findOne({
            where: { email: email },
        });

        if (!user) {
            throw new CustomError("User with this email does not exist!", 404);
        }

        if (user.isVerified) {
            throw new CustomError("Email is already verified.", 400);
        }

        const token = crypto.randomBytes(32).toString("hex");
        user.verificationToken = token;
        await user.save();

        const verificationLink = `${process.env.CLIENT_URL}/api/auth/verify-email/${token}`;
        await transporter.sendMail({
            from: `"Forum App" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Confirm your email address",
            html: `<p>Hello ${user.username},</p>
         <p>Please click the link below to verify your email:</p>
         <a href="${verificationLink}">${verificationLink}</a>`,
        });

        return "Verification email resent. Please check your inbox.";
    },
};

type AccessTokenUser = {
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

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await RefreshToken.create({
        token: refreshToken,
        expiresAt: expiresAt,
        user_id: parseInt(user.id),
    });

    return { accessToken, refreshToken };
}
