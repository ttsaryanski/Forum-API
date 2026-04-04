import jwt from "jsonwebtoken";
import { Socket, DefaultEventsMap } from "socket.io";

import { verifyJwt } from "../lib/jwt.js";

import { CustomError } from "../utils/errorUtils/customError.js";

import { RequestUser } from "../types/express.js";

type SocketData = {
    user?: RequestUser;
};

export type AuthenticatedSocket = Socket<
    DefaultEventsMap,
    DefaultEventsMap,
    DefaultEventsMap,
    SocketData
>;

const socketAuthMiddleware = async (
    socket: AuthenticatedSocket,
    next: (err?: Error) => void
) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
        return next(new Error("Unauthorized"));
    }

    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new CustomError("JWT secret is not configured!", 500);
        }

        const decoded = await verifyJwt(token, secret);
        socket.data.user = decoded as RequestUser;

        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return next(new CustomError("Access token expired!", 401));
        }

        if (error instanceof jwt.JsonWebTokenError) {
            return next(new CustomError("Invalid access token!", 401));
        }
        next(error as Error);
    }
};

export { socketAuthMiddleware };
