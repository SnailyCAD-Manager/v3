import { useInstance } from "@/hooks/useInstance";
import { useSocket } from "@/hooks/useSocket";
import { Instance } from "@/types/instance";
import { LogData } from "@/types/socket";
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
                        logs:
                            useInstance
                                .getState()
                                .instances.find((i) => i.id === instance.id)
                                ?.logs || [],
                        env: instance.env,
                    });
                    console.log("updated", instance.id);
                } else {
                    console.log(instanceIds, instance.id);
                    addInstance(instance);
                    console.log("added", instance.id);
                }
            });

            instanceIds.forEach((id) => {
                if (!updatedInstanceIds.includes(id)) {
                    removeInstance(id);
                }
            });
        }

        function onInstanceLog(data: LogData) {
            const instance = instances.find((i) => i.id === data.id);
            if (!instance) return;

            console.log(data);

            useInstance.getState().addLog(instance.id, data.log);

            console.log(`Instance ${data.id} log:` + data.log);
        }

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("load-instances", onInstanceUpdate);
        socket.on("instance-log", onInstanceLog);
        socket.connect();

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("load-instances", onInstanceUpdate);
        };
    }, []);

    return null;
}
