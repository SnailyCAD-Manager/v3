import { getActiveInstance } from "@/hooks/useInstance";
import { notifications } from "@mantine/notifications";
import type { LogData } from "@scm/types";
import { IconCheck } from "@tabler/icons-react";
import socket from "../socket";

type StopData = {
    id: string;
};

export default async function Stop(id?: string) {
    if (!id) id = getActiveInstance();

    return new Promise<void>((resolve, reject) => {
        const stopNotify = notifications.show({
            title: "Stopping instance...",
            message: "Attempting to stop instance...",
            loading: true,
            autoClose: false,
        });

        socket.emit("server:stop-instance", {
            id,
        } as StopData);

        socket.on("instance-log", (data: LogData) => {
            if (data.id !== id) return;
            if (data.log.includes(`Instance ${id} stopped`)) {
                notifications.update({
                    id: stopNotify,
                    title: "Stopped instance",
                    message: "Successfully stopped instance.",
                    icon: <IconCheck />,
                    color: "green",
                    loading: false,
                    autoClose: true,
                });
                resolve();
            }
        });

        setTimeout(() => {
            notifications.update({
                id: stopNotify,
                title: "Failed to stop instance",
                message: "Failed to stop instance after 10 seconds.",
                color: "red",
                loading: false,
                autoClose: true,
            });
            reject("Timeout exceeded. Failed to stop instance.");
        }, 10000);
    });
}
