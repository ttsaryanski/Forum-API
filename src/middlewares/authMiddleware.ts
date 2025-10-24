import { Request, Response, NextFunction } from "express";
import { Model } from "sequelize";
import { verifyJwt } from "../lib/jwt.js";

import { RequestUser } from "../types/express.js";

import { CustomError } from "../utils/errorUtils/customError.js";

import RefreshToken from "../models/RefreshToken.js";

interface RefreshTokenAttributes {
    id: number;
    token: string;
    expiresAt: Date;
    userId: number;
}

interface RefreshTokenInstance
    extends Model<RefreshTokenAttributes>,
        RefreshTokenAttributes {}

const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.cookies?.refreshToken;

        if (!token) {
            throw new CustomError("Missing token!", 401);
        }

        const dbToken = (await RefreshToken.findOne({
            where: { token },
        })) as RefreshTokenInstance | null;
        if (!dbToken) {
            throw new CustomError("Invalid or expired token!", 403);
        }
        if (dbToken.expiresAt < new Date()) {
            await dbToken.destroy();
            throw new CustomError("Token expired!", 403);
        }

        const secret = process.env.JWT_REFRESH_SECRET;
        if (!secret) {
            throw new CustomError("JWT refresh secret is not configured!", 500);
        }
        const decodedToken = await verifyJwt(token, secret);

        req.user = decodedToken as RequestUser;
        req.isAuthenticated = true;

        next();
    } catch (error) {
        if (req.cookies.refreshToken) {
            res.clearCookie("refreshToken");
        }

        next(error);
    }
};

export { authMiddleware };
