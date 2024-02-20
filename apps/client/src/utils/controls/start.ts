import {
    getActiveInstance,
    getActiveInstanceData,
    useInstance,
} from "@/hooks/useInstance";
import socket from "../socket";
import type { StartData } from "@scm/types";
import invalidValues from "../env/invalidValues";
import { notifications } from "@mantine/notifications";
import useKeys from "@/hooks/useKeys";

export default async function Start() {
    const id = getActiveInstance();
    const shiftKey = useKeys.getState().shiftKey;

    await invalidValueCheck();

    socket.emit("server:start-instance", {
        id,
        build: !shiftKey,
    } as StartData);
}

async function invalidValueCheck() {
    return new Promise<void>((resolve, reject) => {
        const instance = getActiveInstanceData();
        const test_CORS_ORIGIN_URL = async () => {
            const value = instance?.env.CORS_ORIGIN_URL;
            if (
                invalidValues.CORS_ORIGIN_URL.some((v) =>
                    v.includes?.some((i) => value?.includes(i))
                )
            ) {
                notifications.show({
                    title: "Failed to start instance",
                    message: "Invalid CORS_ORIGIN_URL value in .env file.",
                    color: "red",
                });

                useInstance
                    .getState()
                    .addLog(
                        getActiveInstance(),
                        `<span style="background-color: red; color: white">&nbsp;ERR_START_FAIL&nbsp;</span> Invalid CORS_ORIGIN_URL value in .env file.`
                    );

                reject();
            }
        };

        const test_NEXT_PUBLIC_CLIENT_URL = async () => {
            const value = instance?.env.NEXT_PUBLIC_CLIENT_URL;
            if (
                invalidValues.NEXT_PUBLIC_CLIENT_URL.some((v) =>
                    v.includes?.some((i) => value?.includes(i))
                )
            ) {
                notifications.show({
                    title: "Failed to start instance",
                    message:
                        "Invalid NEXT_PUBLIC_CLIENT_URL value in .env file.",
                    color: "red",
                });

                useInstance
                    .getState()
                    .addLog(
                        getActiveInstance(),
                        `<span style="background-color: red; color: white">&nbsp;ERR_START_FAIL&nbsp;</span> Invalid NEXT_PUBLIC_CLIENT_URL value in .env file.`
                    );

                reject();
            }
        };

        const test_NEXT_PUBLIC_PROD_ORIGIN = async () => {
            const value = instance?.env.NEXT_PUBLIC_PROD_ORIGIN;
            if (
                invalidValues.NEXT_PUBLIC_PROD_ORIGIN.some((v) =>
                    v.includes?.some((i) => value?.includes(i))
                )
            ) {
                notifications.show({
                    title: "Failed to start instance",
                    message:
                        "Invalid NEXT_PUBLIC_PROD_ORIGIN value in .env file.",
                    color: "red",
                });

                useInstance
                    .getState()
                    .addLog(
                        getActiveInstance(),
                        `<span style="background-color: red; color: white">&nbsp;ERR_START_FAIL&nbsp;</span> Invalid NEXT_PUBLIC_PROD_ORIGIN value in .env file.`
                    );

                reject();
            }
        };

        Promise.all([
            test_CORS_ORIGIN_URL(),
            test_NEXT_PUBLIC_CLIENT_URL(),
            test_NEXT_PUBLIC_PROD_ORIGIN(),
        ]).then(() => {
            resolve();
        });
    });
}
