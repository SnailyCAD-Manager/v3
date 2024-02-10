import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import type { StorageInstance, User } from "@scm/types";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export default class ManageDatabase {
    static async init() {
        // console.log(fs.existsSync(dbPath));
        // if (!fs.existsSync(dbPath)) {
        //     await fs.promises.mkdir(path.resolve(process.cwd(), "data"));
        //     await fs.promises.writeFile(dbPath, "");
        //     console.log("Created database file.");
        // }

        // db.exec(`
        //     CREATE TABLE IF NOT EXISTS users (
        //         id TEXT,
        //         username TEXT,
        //         password TEXT,
        //         role TEXT
        //     )
        // `);
        // console.log("Created users table.");

        // db.exec(`
        //     CREATE TABLE IF NOT EXISTS instances (
        //         id TEXT,
        //         name TEXT,
        //         settings TEXT
        //     )
        // `);

        // // Insert into users if the user doesn't already exist, a default admin user.
        // const adminUserExists = db.prepare(
        //     "SELECT * FROM users WHERE role = ?"
        // );
        // if (!adminUserExists.get("admin")) {
        //     const adminPassword = uuid();
        //     const adminPasswordHash = await bcrypt.hash(adminPassword, 10);
        //     db.prepare(
        //         "INSERT INTO users (id, username, password, role) VALUES (?, ?, ?, ?)"
        //     ).run(uuid(), "admin", adminPasswordHash, "admin");
        //     console.log(
        //         `Created default admin user with password: ${adminPassword}`
        //     );
        // }

        const defaultAdminExists = await prisma.user.findFirst({
            where: {
                username: "admin",
            },
        });

        if (!defaultAdminExists) {
            const adminPassword = "admin";
            const adminPasswordHash = await bcrypt.hash(adminPassword, 10);
            await prisma.user.create({
                data: {
                    id: uuid(),
                    username: "admin",
                    password: adminPasswordHash,
                    role: "admin",
                },
            });
            console.log(
                `Created default admin user with password: ${adminPassword}`
            );
        }
    }

    static users = {
        addUser: async (data: User) => {
            const passwordHash = await bcrypt.hash(data.password, 10);
            await prisma.user.create({
                data: {
                    id: uuid(),
                    username: data.username,
                    password: passwordHash,
                    role: data.role,
                },
            });
        },
        getUser: (username: string) => {
            return prisma.user.findFirst({
                where: {
                    username,
                },
            });
        },
        getUsers: () => {
            return prisma.user.findMany();
        },
        deleteUser: (id: string) => {
            return prisma.user.delete({
                where: {
                    id,
                },
            });
        },
        updateUser: async (data: User) => {
            return prisma.user.update({
                where: {
                    id: data.id,
                },
                data: {
                    username: data.username,
                    role: data.role,
                    password: await bcrypt.hash(data.password, 10),
                },
            });
        },
    };

    static instances = {
        addInstance: (instance: StorageInstance) => {
            prisma.storageInstance.create({
                data: {
                    id: instance.id,
                    name: instance.name,
                    settings: JSON.stringify(instance.settings),
                },
            });
        },
        getInstance: async (id: string) => {
            const instance = await prisma.storageInstance.findFirst({
                where: {
                    id,
                },
            });
            const parsedSettings = JSON.parse(
                instance?.settings as unknown as string
            );
            const formattedInstance = {
                ...instance,
                settings: parsedSettings,
            };
            return formattedInstance as StorageInstance;
        },
        getInstances: async () => {
            const instances = await prisma.storageInstance.findMany();
            return instances.map((instance) => {
                const parsedSettings = JSON.parse(
                    instance.settings as unknown as string
                );
                return {
                    ...instance,
                    settings: parsedSettings,
                };
            });
        },
        deleteInstance: (id: string) => {
            return prisma.storageInstance.delete({
                where: {
                    id,
                },
            });
        },
        updateInstance: (instance: StorageInstance) => {
            return prisma.storageInstance.update({
                where: {
                    id: instance.id,
                },
                data: {
                    name: instance.name,
                    settings: JSON.stringify(instance.settings),
                },
            });
        },
    };
}
