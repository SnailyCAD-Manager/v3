import { useInstance } from "@/hooks/useInstance";
import { useSocket } from "@/hooks/useSocket";
import type { Instance, LogData, UserLoginReturnData } from "@scm/types";
import logs from "@/utils/debug/logs";
import socket from "@/utils/socket";
import { notifications } from "@mantine/notifications";
import { nprogress } from "@mantine/nprogress";
import { useEffect } from "react";
import { useUpdate } from "@/hooks/useUpdate";
import { useAuth } from "@/hooks/useAuth";
import { usePage } from "@/hooks/usePage";

export default function SocketProvider(): null {
    const { setConnected } = useSocket();
    const removeInstance = useInstance((state) => state.removeInstance);
    const addInstance = useInstance((state) => state.addInstance);
    const updateInstance = useInstance((state) => state.updateInstance);
    const addLog = useInstance((state) => state.addLog);
    const setInstancesLoaded = useInstance((state) => state.setInstancesLoaded);
    const setUpdateInProgress = useUpdate((state) => state.setInProgress);
    const setIsAuth = useAuth((state) => state.setIsAuth);
    const setUser = useAuth((state) => state.setUser);
    const setPage = usePage((state) => state.setPage);

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
                        logs:
                            useInstance
                                .getState()
                                .instances.find((i) => i.id === instance.id)
                                ?.logs || [],
                        versions: instance.versions,
                        env: instance.env,
                    });
                } else {
                    addInstance({
                        id: instance.id,
                        name: instance.name,
                        status: instance.status,
                        logs: [],
                        versions: instance.versions,
                        env: instance.env,
                    });
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
            if (data.type === "console") {
                return;
            }

            addLog(data.id, data.log);
        }

        function onUpdate(data: {
            inProgress: boolean;
            id: string;
            error?: boolean;
        }) {
            setUpdateInProgress(data.id, data.inProgress);
            if (data.error) {
                notifications.show({
                    title: "Update Error",
                    message: "An error occurred while updating SnailyCAD",
                    color: "red",
                });
            } else if (!data.inProgress) {
                notifications.show({
                    title: "Update Complete",
                    message: "SnailyCAD has been updated",
                    color: "teal",
                });
            }
        }

        function onLogin(data: UserLoginReturnData) {
            setUser(data.user);
            setIsAuth(true);

            if (data.user.passwordResetAtNextLogin) {
                setPage("password-reset");
            }

            notifications.show({
                title: "Logged in",
                message: "Successfully logged in",
                color: "green",
            });

            localStorage.setItem("snailycad-manager:session", data.sessionId);
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
        socket.on("instance-delete-complete", () => {
            useInstance.getState().setInstanceDeletionInProgress(false);
            window.location.reload();
        });
        socket.on("client:update-instance", onUpdate);
        socket.on("client:user-login", onLogin);
        socket.on("client:delete-user", (id: string) => {
            if (id === useAuth.getState().user?.id) {
                setIsAuth(false);
                setUser(null);
                localStorage.removeItem("snailycad-manager:session");
                notifications.show({
                    title: "User Deleted",
                    message: "Your user has been deleted",
                    color: "red",
                });
            }
        });
        socket.connect();

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("load-instances", onInstanceUpdate);
            socket.off("instance-log", onInstanceLog);
            socket.off("error");
            socket.off("instance-delete-complete");
            socket.off("client:update-instance", onUpdate);
            socket.off("client:user-login", onLogin);
            socket.off("client:delete-user");
            socket.disconnect();
        };
    }, []);

    return null;
}
