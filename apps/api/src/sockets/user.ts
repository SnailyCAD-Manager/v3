import type { Socket } from "socket.io";
import { AddUserData, UserLoginData, UserLoginReturnData } from "@scm/types";
import ManageDatabase, { prisma } from "../util/database";
import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";

export default function HandleUser(socket: Socket) {
    socket.on("server:add-user", async (data: AddUserData) => {
        await ManageDatabase.users.addUser({
            id: uuid(),
            username: data.username,
            password: await bcrypt.hash(data.password, 10),
            passwordResetAtNextLogin: true,
            role: data.role,
        });

        const users = await ManageDatabase.users.getUsers();
        socket.emit("client:get-users", users);
    });

    socket.on("server:get-users", async () => {
        const users = await ManageDatabase.users.getUsers();
        socket.emit("client:get-users", users);
    });

    socket.on("server:delete-user", async (id: string) => {
        await ManageDatabase.users.deleteUser(id);
    });

    socket.on("server:update-user", async (data: any) => {
        await ManageDatabase.users.updateUser(data);

        const users = await ManageDatabase.users.getUsers();
        socket.emit("client:get-users", users);
    });

    socket.on("server:user-login", async (data: UserLoginData) => {
        const user = await ManageDatabase.users.getUser(data.username);
        if (!user) {
            socket.emit("error", "User not found.");
            return;
        }
        const passwordMatch = await bcrypt.compare(
            data.password,
            user.password
        );
        if (!passwordMatch) {
            socket.emit("error", "Incorrect password.");
            return;
        }

        await prisma.session.create({
            data: {
                id: uuid(),
                userId: user.id,
                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
            },
        });

        const session = await prisma.session.findFirst({
            where: {
                userId: user.id,
            },
        });

        socket.emit("client:user-login", {
            user,
            sessionId: session?.id,
        } as unknown as UserLoginReturnData);
    });

    socket.on("server:user-session", async (id: string) => {
        const session = await prisma.session.findFirst({
            where: {
                id,
            },
        });

        if (!session) {
            socket.emit("error", "User session not found.");
            return;
        }

        if (session.expiresAt < new Date()) {
            socket.emit("error", "User session expired.");
            return;
        }

        const user = await prisma.user.findFirst({
            where: {
                Session: {
                    some: {
                        id,
                    },
                },
            },
        });

        if (!user) {
            socket.emit("error", "User from session not found.");
            return;
        }

        socket.emit("client:user-login", {
            user,
            sessionId: session.id,
        } as unknown as UserLoginReturnData);
    });

    socket.on("server:user-logout", async (userId: string) => {
        await prisma.session.deleteMany({
            where: {
                userId,
            },
        });
    });
}
