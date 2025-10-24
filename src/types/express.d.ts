import { Type } from "js-yaml";
import { JwtPayload } from "jsonwebtoken";

export type RequestUser = {
    id: string;
    email: string;
    username: string;
    role: string;
};

declare global {
    namespace Express {
        interface Request {
            user?: RequestUser;
            isAuthenticated?: boolean;
        }
    }
}
