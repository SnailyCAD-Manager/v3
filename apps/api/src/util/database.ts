import { PrismaClient } from "@prisma/client";
import type { StorageInstance, User } from "@scm/types";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

export const prisma = new PrismaClient();

export default class ManageDatabase {
    static async init() {
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
                    passwordResetAtNextLogin: true,
                    role: "admin",
                },
            });
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
                    passwordResetAtNextLogin: data.passwordResetAtNextLogin,
                    role: data.role,
                },
            });
        },
        getUser: async (username: string) => {
            const user = await prisma.user.findFirst({
                where: {
                    username,
                },
            });

            return user;
        },
        getUsers: async () => {
            const users = await prisma.user.findMany();

            return users;
        },
        deleteUser: async (id: string) => {
            await prisma.session.deleteMany({
                where: {
                    userId: id,
                },
            });

            await prisma.user.delete({
                where: {
                    id,
                },
            });
        },

        updateUser: async (data: {
            username: string;
            newPassword: string | null;
            role: string;
            id: string;
        }) => {
            let passwordHash = null;
            if (data.newPassword) {
                passwordHash = await bcrypt.hash(data.newPassword, 10);
            }
            await prisma.user.update({
                where: {
                    id: data.id,
                },
                data: {
                    username: data.username,
                    role: data.role,
                    password: passwordHash ? passwordHash : undefined,
                },
            });
        },

        resetPassword: async (username: string, newPassword: string) => {
            const passwordHash = await bcrypt.hash(newPassword, 10);
            const foundUser = await prisma.user.findFirst({
                where: {
                    username,
                },
            });

            if (!foundUser) {
                throw new Error("User not found");
            }

            await prisma.user.update({
                where: {
                    id: foundUser.id,
                },
                data: {
                    password: passwordHash,
                    passwordResetAtNextLogin: true,
                },
            });
        },
    };

    static instances = {
        addInstance: async (instance: StorageInstance) => {
            await prisma.storageInstance.create({
                data: {
                    id: instance.id,
                    name: instance.name,
                    path: instance.path,
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
        deleteInstance: async (id: string) => {
            await prisma.storageInstance.delete({
                where: {
                    id,
                },
            });
        },
        updateInstance: async (instance: StorageInstance) => {
            await prisma.storageInstance.update({
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
