import { User } from "../../types/types";
import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";

export default class ManageUser {
    public static async GetUsers(): Promise<User[]> {
        const users = await fs.promises.readFile(
            path.resolve(process.cwd(), "data/users.json"),
            "utf-8"
        );

        return JSON.parse(users);
    }

    public static async GetUserById(id: string): Promise<User | undefined> {
        const users = await ManageUser.GetUsers();

        return users.find((user) => user.id === id);
    }

    public static async GetUserByUsername(
        username: string
    ): Promise<User | undefined> {
        const users = await ManageUser.GetUsers();

        return users.find((user) => user.username === username);
    }

    public static async CreateUser(user: User): Promise<void> {
        const users = await ManageUser.GetUsers();
        users.push({
            ...user,
            id: users.length.toString(),
            password: bcrypt.hashSync(user.password, 10),
        });
        await fs.promises.writeFile(
            path.resolve(process.cwd(), "data/users.json"),
            JSON.stringify(users, null, 4)
        );

        return;
    }

    public static async UpdateUser(user: User): Promise<void> {
        const users = await ManageUser.GetUsers();
        const currentUser = users.find((u) => u.id === user.id);

        if (!currentUser) {
            return;
        }

        const index = users.findIndex((u) => u.id === user.id);
        users[index] = {
            id: currentUser.id,
            password: currentUser.password,
            username: user.username,
            role: user.role,
        };
        await fs.promises.writeFile(
            path.resolve(process.cwd(), "data/users.json"),
            JSON.stringify(users, null, 4)
        );

        return;
    }

    public static async DeleteUser(id: string): Promise<void> {
        const users = await ManageUser.GetUsers();
        const index = users.findIndex((u) => u.id === id);
        users.splice(index, 1);
        await fs.promises.writeFile(
            path.resolve(process.cwd(), "data/users.json"),
            JSON.stringify(users, null, 4)
        );

        return;
    }

    public static async CheckUser(
        username: string,
        password: string
    ): Promise<User | undefined> {
        const user = await ManageUser.GetUserByUsername(username);

        if (!user) {
            return;
        }

        const isPasswordCorrect = bcrypt.compareSync(password, user.password);

        if (!isPasswordCorrect) {
            return;
        }

        return user;
    }

    public static async ChangePassword(
        id: string,
        password: string
    ): Promise<void> {
        const user = await ManageUser.GetUserById(id);

        if (!user) {
            return;
        }

        user.password = bcrypt.hashSync(password, 10);

        await ManageUser.UpdateUser(user);

        return;
    }

    public static async ChangeRole(
        id: string,
        role: "admin" | "user"
    ): Promise<void> {
        const user = await ManageUser.GetUserById(id);

        if (!user) {
            return;
        }

        user.role = role;

        await ManageUser.UpdateUser(user);

        return;
    }
}
