import type { Socket } from "socket.io";
import { AddUserData, UserLoginData } from "@scm/types";
import ManageDatabase from "../util/database";
import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";

export default function HandleUser(socket: Socket) {
    socket.on("server:add-user", async (data: AddUserData) => {
        ManageDatabase.users.addUser({
            id: uuid(),
            username: data.username,
            password: await bcrypt.hash(data.password, 10),
            role: data.role,
        });
    });

    socket.on("server:get-users", () => {
        socket.emit("client:get-users", ManageDatabase.users.getUsers());
    });

    socket.on("server:delete-user", (id: string) => {
        ManageDatabase.users.deleteUser(id);
    });

    socket.on("server:update-user", (data: any) => {
        ManageDatabase.users.updateUser(data);
    });

    socket.on("server:user-login", async (data: UserLoginData) => {
        const user = ManageDatabase.users.getUser(data.username);
        if (!user) return socket.emit("error", "User not found.");
        const passwordMatch = await bcrypt.compare(
            data.password,
            user.password
        );
        if (!passwordMatch) return socket.emit("error", "Incorrect password.");

        socket.emit("client:user-login", user);
    });
}
