import { IconDashboard, IconEdit } from "@tabler/icons-react";
import { create } from "zustand";

type ValidPageId = "login" | "instance-selector" | "home" | "env-editor";

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
];

type PageState = {
    page: Page;
    setPage: (page: ValidPageId) => void;
};

export const usePage = create<PageState>((set) => ({
    page: process.env.NODE_ENV === "development" ? AppPages[0] : AppPages[1],
    setPage: (page) =>
        set(() => ({ page: AppPages.find((p) => p.id === page) })),
}));
