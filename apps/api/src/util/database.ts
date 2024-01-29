import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { StorageInstance, User } from "../../types/types";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

const dbPath = path.resolve(process.cwd(), "data/database.db");

const db = new Database(dbPath);

export default class ManageDatabase {
    static async init() {
        console.log(fs.existsSync(dbPath));
        if (!fs.existsSync(dbPath)) {
            await fs.promises.mkdir(path.resolve(process.cwd(), "data"));
            await fs.promises.writeFile(dbPath, "");
            console.log("Created database file.");
        }

        db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id TEXT,
                username TEXT,
                password TEXT,
                role TEXT
            )
        `);
        console.log("Created users table.");

        db.exec(`
            CREATE TABLE IF NOT EXISTS instances (
                id TEXT,
                name TEXT,
                settings TEXT
            )
        `);

        // Insert into users if the user doesn't already exist, a default admin user.
        const adminUserExists = db.prepare(
            "SELECT * FROM users WHERE role = ?"
        );
        if (!adminUserExists.get("admin")) {
            const adminPassword = uuid();
            const adminPasswordHash = await bcrypt.hash(adminPassword, 10);
            db.prepare(
                "INSERT INTO users (id, username, password, role) VALUES (?, ?, ?, ?)"
            ).run(uuid(), "admin", adminPasswordHash, "admin");
            console.log(
                `Created default admin user with password: ${adminPassword}`
            );
        }
    }

    static users = {
        addUser: (data: User) => {
            const stmt = db.prepare(
                "INSERT INTO users (id, username, password, role) VALUES (?, ?, ?, ?)"
            );
            stmt.run(data.id, data.username, data.password, data.role);
        },
        getUser: (username: string) => {
            const stmt = db.prepare("SELECT * FROM users WHERE username = ?");
            return stmt.get(username) as User;
        },
        getUsers: () => {
            const stmt = db.prepare("SELECT * FROM users");
            return stmt.all();
        },
        deleteUser: (id: string) => {
            const stmt = db.prepare("DELETE FROM users WHERE id = ?");
            stmt.run(id);
        },
        updateUser: (data: User) => {
            const stmt = db.prepare(
                "UPDATE users SET username = ?, password = ?, role = ? WHERE id = ?"
            );
            stmt.run(data.username, data.password, data.role, data.id);
        },
    };

    static instances = {
        addInstance: (instance: StorageInstance) => {
            const stmt = db.prepare(
                "INSERT INTO instances (id, name, settings) VALUES (?, ?, ?)"
            );
            stmt.run(
                instance.id,
                instance.name,
                JSON.stringify(instance.settings)
            );
        },
        getInstance: (id: string) => {
            const stmt = db.prepare("SELECT * FROM instances WHERE id = ?");
            const instance = stmt.get(id) as unknown as StorageInstance;
            const parsedSettings = JSON.parse(
                instance.settings as unknown as string
            );
            const formattedInstance = {
                ...instance,
                settings: parsedSettings,
            };
            return formattedInstance as StorageInstance;
        },
        getInstances: () => {
            const stmt = db.prepare("SELECT * FROM instances");
            const instances = stmt.all() as unknown as StorageInstance[];
            const formattedInstances = instances.map((instance) => {
                const parsedSettings = JSON.parse(
                    instance.settings as unknown as string
                );
                const formattedInstance = {
                    ...instance,
                    settings: parsedSettings,
                };
                return formattedInstance;
            });
            return formattedInstances;
        },
        deleteInstance: (id: string) => {
            const stmt = db.prepare("DELETE FROM instances WHERE id = ?");
            stmt.run(id);
        },
        updateInstance: (instance: StorageInstance) => {
            const stmt = db.prepare(
                "UPDATE instances SET name = ?, settings = ? WHERE id = ?"
            );
            stmt.run(
                instance.name,
                JSON.stringify(instance.settings),
                instance.id
            );
        },
    };
}
