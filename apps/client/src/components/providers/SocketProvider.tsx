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
            console.log("updated instances", updatedInstances);
            const updatedInstanceIds = updatedInstances.map(
                (instance) => instance.id
            );
            const currentInstanceIds = instances.map((instance) => instance.id);

            const removedInstanceIds = currentInstanceIds.filter(
                (id) => !updatedInstanceIds.includes(id)
            );
            const addedInstanceIds = updatedInstanceIds.filter(
                (id) => !currentInstanceIds.includes(id)
            );

            removedInstanceIds.forEach((id) => removeInstance(id));
            addedInstanceIds.forEach((id) =>
                addInstance(
                    updatedInstances.find((instance) => instance.id === id)!
                )
            );

            updatedInstances.forEach((instance) => {
                if (currentInstanceIds.includes(instance.id)) {
                    updateInstance({
                        ...instance,
                        logs:
                            instances.find((i) => i.id === instance.id)?.logs ||
                            [],
                    });
                }
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
