// socket/handlers/chatHandlers.ts
import { Server } from "socket.io";

import Message from "../../../models/messages.js";
import User from "../../../models/User.js";

import type { AuthenticatedSocket } from "../../../middlewares/socketMiddleware.js";

export const registerChatHandlers = (
    io: Server,
    socket: AuthenticatedSocket
) => {
    socket.on("join_room", async (category_id) => {
        socket.join(category_id);

        console.log(`User ${socket.data.user?.id} joined room ${category_id}`);

        // const messages = await Message.findAll({
        //   where: { category_id },
        //   order: [["createdAt", "DESC"]],
        //   limit: 50,
        // });

        // socket.emit("room_history", messages.reverse());
    });

    socket.on("leave_room", (category_id) => {
        socket.leave(category_id);
    });

    const lastMessageTime = new Map<string, number>();
    socket.on(
        "send_message",
        async ({
            categoryId,
            content,
        }: {
            categoryId: string;
            content: string;
        }) => {
            const now = Date.now();
            const last = lastMessageTime.get(socket.data.user?.id || "") || 0;
            if (now - last < 500 || !content?.trim()) {
                return;
            }

            const newMessage = await Message.create({
                content,
                category_id: Number(categoryId),
                author_id: Number(socket.data.user?.id),
            });

            const message = await Message.findByPk(newMessage.dataValues.id, {
                include: [
                    {
                        model: User,
                        as: "author",
                        attributes: ["id", "username", "avatar_url"],
                    },
                ],
            });

            io.to(categoryId).emit("receive_message", message);
        }
    );

    socket.on("typing", ({ categoryId }) => {
        socket.to(categoryId).emit("typing", {
            userId: socket.data.user?.id,
            username: socket.data.user?.username,
        });
    });

    socket.on("stop_typing", ({ categoryId }) => {
        socket.to(categoryId).emit("stop_typing", {
            userId: socket.data.user?.id,
        });
    });
};
