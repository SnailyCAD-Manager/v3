import {
    IconDashboard,
    IconEdit,
    IconKeyboard,
    IconSettings,
    IconTools,
} from "@tabler/icons-react";
import { create } from "zustand";

type ValidPageId =
    | "login"
    | "instance-selector"
    | "home"
    | "env-editor"
    | "instance-create"
    | "tools"
    | "keyboard-shortcuts"
    | "settings";

type Page = {
    name: string;
    id: ValidPageId;
    icon?: React.ReactNode;
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
        name: "Settings",
        icon: <IconSettings size={20} />,
        id: "settings",
    },
    {
        name: "Instance Create",
        id: "instance-create",
        noNav: true,
    },
];

type PageState = {
    page: Page;
    setPage: (page: ValidPageId) => void;
};

const defaultPage: ValidPageId =
    process.env.NODE_ENV === "development" ? "instance-selector" : "login";

export const usePage = create<PageState>((set) => ({
    page: AppPages.find((p) => p.id === defaultPage)!,
    setPage: (page) =>
        set(() => ({ page: AppPages.find((p) => p.id === page) })),
}));
