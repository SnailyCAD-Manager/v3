import {
    IconDashboard,
    IconEdit,
    IconKeyboard,
    IconSettings,
    IconTools,
    IconUsersGroup,
} from "@tabler/icons-react";
import { create } from "zustand";

export type ValidPageId =
    | "login"
    | "instance-selector"
    | "home"
    | "env-editor"
    | "instance-create"
    | "tools"
    | "keyboard-shortcuts"
    | "instance-settings"
    | "users"
    | "password-reset";

type Page = {
    name: string;
    id: ValidPageId;
    icon?: React.ReactNode;
    roleRequired?: string;
    noNav?: boolean;
};

export const AppPages: Page[] = [
    {
        name: "Instance Selector",
        id: "instance-selector",
        noNav: true,
    },
    {
        name: "Login",
        id: "login",
        noNav: true,
    },
    {
        name: "Dashboard",
        icon: <IconDashboard size={20} />,
        id: "home",
    },
    {
        name: "ENV Editor",
        icon: <IconEdit size={20} />,
        id: "env-editor",
    },
    {
        name: "Tools",
        icon: <IconTools size={20} />,
        id: "tools",
    },
    {
        name: "Keyboard Shortcuts",
        icon: <IconKeyboard size={20} />,
        id: "keyboard-shortcuts",
    },
    {
        name: "Instance Settings",
        icon: <IconSettings size={20} />,
        id: "instance-settings",
    },
    {
        name: "Instance Create",
        id: "instance-create",
        noNav: true,
    },
    {
        name: "Users",
        roleRequired: "admin",
        icon: <IconUsersGroup size={20} />,
        id: "users",
    },
    {
        name: "Password Reset",
        id: "password-reset",
        noNav: true,
    },
];

type PageState = {
    page: Page;
    setPage: (page: ValidPageId) => void;
};

const defaultPage: ValidPageId =
    process.env.NODE_ENV === "development"
        ? "instance-selector"
        : "instance-selector";

export const usePage = create<PageState>((set) => ({
    page: AppPages.find((p) => p.id === defaultPage)!,
    setPage: (page) => {
        if (!AppPages.find((p) => p.id === page)) {
            console.error(`Invalid page ID: ${page}`);
            return;
        }
        set(() => ({ page: AppPages.find((p) => p.id === page) }));
    },
}));
