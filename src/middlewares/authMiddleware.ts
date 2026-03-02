import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { verifyJwt } from "../lib/jwt.js";

import { CustomError } from "../utils/errorUtils/customError.js";

import { RequestUser } from "../types/express.js";

const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new CustomError("Missing access token!", 401);
        }

        const token = authHeader.split(" ")[1];
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new CustomError("JWT secret is not configured!", 500);
        }

        const decodedToken = await verifyJwt(token, secret);
        req.user = decodedToken as RequestUser;
        req.isAuthenticated = true;

        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return next(new CustomError("Access token expired!", 401));
        }

        if (error instanceof jwt.JsonWebTokenError) {
            return next(new CustomError("Invalid access token!", 401));
        }
        next(error);
    }
};

export { authMiddleware };
