import { useInstance } from "@/hooks/useInstance";
import { useSocket } from "@/hooks/useSocket";
import { Instance } from "@/types/instance";
import { LogData } from "@/types/socket";
import logs from "@/utils/debug/logs";
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

        setActiveInstance("new");

        function onDisconnect() {
            notifications.show({
                title: "Disconnected from server",
                message: "Lost connection to server",
                color: "red",
            });
            setConnected(false);
        }

        function onInstanceUpdate(updatedInstances: Instance[]) {
            /* 
                If the instances already exists, and it's found in the updatedInstances array, update it.
                If the instance already exists, but it's not found in the updatedInstances array, remove it.
                If the instance doesn't exist, but it's found in the updatedInstances array, add it.
            */

            const updatedInstanceIds = updatedInstances.map((i) => i.id);
            const instanceIds = useInstance
                .getState()
                .instances.map((i) => i.id);

            updatedInstances.forEach((instance) => {
                if (instanceIds.includes(instance.id)) {
                    updateInstance({
                        id: instance.id,
                        name: instance.name,
                        status: instance.status,
                        logs: useInstance.getState().activeInstanceData
                            ?.logs as string[],
                        env: instance.env,
                    });
                } else {
                    addInstance({
                        id: instance.id,
                        name: instance.name,
                        status: instance.status,
                        logs: [],
                        env: instance.env,
                    });
                    console.log(instance);
                    logs.info(`Added instance ${instance.name}`);
                }
            });

            instanceIds.forEach((id) => {
                if (!updatedInstanceIds.includes(id)) {
                    removeInstance(id);
                }
            });
        }

        function onInstanceLog(data: LogData) {
            console.log(data);

            const instance = instances.find((i) => i.id === data.id);
            if (!instance) return;

            useInstance.getState().addLog(data.id, data.log);
        }

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("load-instances", onInstanceUpdate);
        socket.on("instance-log", onInstanceLog);
        socket.on("error", (error: string) => {
            notifications.show({
                title: "Error",
                message: error,
                color: "red",
            });
        });
        socket.connect();

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("load-instances", onInstanceUpdate);
            socket.off("instance-log", onInstanceLog);
            socket.off("error");
            // socket.disconnect();
        };
    }, []);

    return null;
}
