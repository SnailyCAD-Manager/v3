import { getActiveInstance } from "@/hooks/useInstance";
import socket from "../socket";
import { notifications } from "@mantine/notifications";
import { LogData } from "@scm/types";
import { IconCheck } from "@tabler/icons-react";

type StopData = {
    id: string;
};

export default function Stop() {
    const id = getActiveInstance();

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
        }
    });
}
