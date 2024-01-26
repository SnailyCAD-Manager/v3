import type { Socket } from "socket.io";
import { AddUserData } from "../../types/types";
import ManageUser from "../util/user";

export default function HandleUser(socket: Socket) {
    socket.on("server:add-user", async (data: AddUserData) => {
        try {
            await ManageUser.CreateUser(data);
        } catch (error) {
            socket.emit("error", `Failed to add user: ${error}`);
        }
    });

    socket.on("server:get-users", async () => {
        try {
            const users = await ManageUser.GetUsers();
            socket.emit("server:users", users);
        }
    })
}
