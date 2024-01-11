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
    const setActiveInstance = useInstance((state) => state.setActiveInstance);
    const activeInstanceData = useInstance((state) => state.activeInstanceData);
    const removeInstance = useInstance((state) => state.removeInstance);
    const addInstance = useInstance((state) => state.addInstance);
    const updateInstance = useInstance((state) => state.updateInstance);
    const addLog = useInstance((state) => state.addLog);
    const setInstancesLoaded = useInstance((state) => state.setInstancesLoaded);

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
            setInstancesLoaded(true);

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
                        logs: activeInstanceData?.logs || [],
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

            addLog(data.id, data.log);
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
            socket.disconnect();
        };
    }, []);

    return null;
}
