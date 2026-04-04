// socket/index.ts
import { Server as SocketIOServer } from "socket.io";
import type { Server as HttpServer } from "http";

import { socketAuthMiddleware } from "../middlewares/socketMiddleware.js";
import { registerChatHandlers } from "../utils/socket/handlers/chatHandler.js";

export const initSocket = (server: HttpServer) => {
    const io = new SocketIOServer(server, {
        cors: {
            origin: "*",
        },
    });

    io.use(socketAuthMiddleware);

    io.on("connection", (socket) => {
        console.log("User connected:", socket.data.user?.id);

        registerChatHandlers(io, socket);

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.data.user?.id);
        });
    });

    return io;
};
