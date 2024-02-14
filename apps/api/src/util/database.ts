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
            await prisma.user.delete({
                where: {
                    id,
                },
            });
        },
        /* 
        username:
            values.username === ""
                ? props.editMode.user.username
                : values.username,
        newPassword: values.password === "" ? null : values.password,
        role: values.role,
        id: props.editMode.user.id,
        */
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
            // Update the user, but if there is no new password, don't update the password
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
    };

    static instances = {
        addInstance: async (instance: StorageInstance) => {
            await prisma.storageInstance.create({
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
