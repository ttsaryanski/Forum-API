import { Request, Response, NextFunction } from "express";
import { Model } from "sequelize";

import { verifyJwt } from "../lib/jwt.js";
import { CustomError } from "../utils/errorUtils/customError.js";

import RefreshToken from "../models/RefreshToken.js";

import { RequestUser } from "../types/express.js";

interface RefreshTokenAttributes {
    id: number;
    token: string;
    user_id: number;
}

interface RefreshTokenInstance
    extends Model<RefreshTokenAttributes>,
        RefreshTokenAttributes {}

const refreshTokenMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.cookies?.refreshToken;
        if (!token) {
            throw new CustomError("Missing refresh token!", 401);
        }

        const dbToken = (await RefreshToken.findOne({
            where: { token },
        })) as RefreshTokenInstance | null;

        if (!dbToken) {
            throw new CustomError("Invalid refresh token!", 401);
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
        if (req.cookies?.refreshToken) {
            res.clearCookie("refreshToken");
        }

        if (error instanceof Error) {
            if (error.name === "TokenExpiredError") {
                const cookieToken = req.cookies?.refreshToken;
                if (cookieToken) {
                    await RefreshToken.destroy({
                        where: { token: cookieToken },
                    });
                }
                next(
                    new CustomError(
                        "Refresh token expired, please log in again!",
                        401
                    )
                );
                return;
            }
            if (error.name === "JsonWebTokenError") {
                next(new CustomError("Invalid refresh token!", 401));
                return;
            }
        }

        next(error);
    }
};

export { refreshTokenMiddleware };
