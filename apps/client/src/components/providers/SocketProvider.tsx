import { useInstance } from "@/hooks/useInstance";
import { useSocket } from "@/hooks/useSocket";
import { Instance } from "@/types/instance";
import socket from "@/utils/socket";
import { notifications } from "@mantine/notifications";
import { nprogress } from "@mantine/nprogress";
import { useEffect } from "react";

export default function SocketProvider(): null {
    const { setConnected } = useSocket();
    const {
        setActiveInstance,
        instances,
        removeInstance,
        addInstance,
        updateInstance,
    } = useInstance();

    useEffect(() => {
        function onConnect() {
            notifications.show({
                title: "Connected to server",
                message: "Successfully connected to server",
                color: "green",
            });
            setConnected(true);
            nprogress.complete();
        }

        console.log(instances);
        setActiveInstance("dev");

        function onDisconnect() {
            notifications.show({
                title: "Disconnected from server",
                message: "Lost connection to server",
                color: "red",
            });
            setConnected(false);
        }

        function onInstanceUpdate(updatedInstances: Instance[]) {
            updatedInstances.forEach((instance: Instance) => {
                // If the instance is already in the list, update it
                if (instances.find((i) => i.id === instance.id)) {
                    updateInstance({
                        id: instance.id,
                        logs: instances.find((i) => i.id === instance.id)!.logs,
                        env: instance.env,
                        name: instance.name,
                        status: instance.status,
                    });
                } else {
                    // Otherwise, add it
                    addInstance(instance);
                }

                instances.forEach((i) => {
                    if (!updatedInstances.find((u) => u.id === i.id)) {
                        removeInstance(i.id);
                    }
                });
            });
        }

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("load-instances", onInstanceUpdate);
        socket.connect();

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("load-instances", onInstanceUpdate);
        };
    }, []);

    return null;
}
