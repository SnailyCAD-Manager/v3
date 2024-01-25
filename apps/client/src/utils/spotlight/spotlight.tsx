import type {
    SpotlightActionData,
    SpotlightActionGroupData,
} from "@mantine/spotlight";
import Controls from "../controls";
import {
    IconDashboard,
    IconEdit,
    IconKeyboard,
    IconPlayerPlay,
    IconRefresh,
    IconSettings,
    IconSquare,
    IconTools,
} from "@tabler/icons-react";
import { usePage } from "@/hooks/usePage";

const SpotlightActions: (SpotlightActionData | SpotlightActionGroupData)[] = [
    {
        group: "Controls",
        actions: [
            {
                id: "start",
                label: "Start SnailyCAD",
                description:
                    "Start the currently selected instance of SnailyCAD",
                leftSection: <IconPlayerPlay />,
                onClick: () => {
                    Controls.Start();
                },
            },
            {
                id: "restart",
                label: "Restart SnailyCAD",
                description:
                    "Restart the currently selected instance of SnailyCAD",
                leftSection: <IconRefresh />,
                onClick: () => {
                    // Controls.Restart();
                },
            },
            {
                id: "stop",
                label: "Stop SnailyCAD",
                description:
                    "Stop the currently selected instance of SnailyCAD",
                leftSection: <IconSquare />,
                onClick: () => {
                    Controls.Stop();
                },
            },
        ],
    },
    {
        group: "Pages",
        actions: [
            {
                id: "dashboard",
                label: "Dashboard",
                description: "Go to the dashboard",
                leftSection: <IconDashboard />,
                onClick: () => {
                    usePage.getState().setPage("home");
                },
            },
            {
                id: "env-editor",
                label: "Environment Variable ",
                description: "Edit the environment variables",
                leftSection: <IconEdit />,
                onClick: () => {
                    usePage.getState().setPage("env-editor");
                },
            },
            {
                id: "tools",
                label: "Tools",
                description: "Go to the tools page",
                leftSection: <IconTools />,
                onClick: () => {
                    usePage.getState().setPage("tools");
                },
            },
            {
                id: "keyboard-shortcuts",
                label: "Keyboard Shortcuts",
                description: "View the keyboard shortcuts",
                leftSection: <IconKeyboard />,
                onClick: () => {
                    usePage.getState().setPage("keyboard-shortcuts");
                },
            },
            {
                id: "instance-settings",
                label: "Instance Settings",
                description: "Edit the instance settings",
                leftSection: <IconSettings />,
                onClick: () => {
                    usePage.getState().setPage("instance-settings");
                },
            },
        ],
    },
];

export default SpotlightActions;
