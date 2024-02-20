import { getActiveInstanceData, useInstance } from "@/hooks/useInstance";
import { usePage } from "@/hooks/usePage";
import { notifications } from "@mantine/notifications";
import type { Env } from "@scm/types";
import socket from "../socket";

export default function SaveEnv(newEnv: Env) {
    const instance = getActiveInstanceData();

    if (!instance) {
        notifications.show({
            title: "Failed to save env",
            message: "No active instance selected.",
            color: "red",
        });
        return;
    }

    instance.env = newEnv;

    useInstance.getState().updateInstance(instance);

    socket.emit("server:save-env", {
        id: instance.id,
        env: newEnv,
    });

    notifications.show({
        title: "Saved env",
        message: "Successfully saved environment variables.",
        color: "green",
    });

    usePage.getState().setPage("home");
}
