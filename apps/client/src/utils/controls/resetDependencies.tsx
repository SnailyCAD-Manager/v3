import { modals } from "@mantine/modals";

import { getActiveInstance } from "@/hooks/useInstance";
import Stop from "./stop";
import { notifications } from "@mantine/notifications";
import type { ResetDependenciesData } from "@scm/types";
import socket from "../socket";
import { usePage } from "@/hooks/usePage";

export default async function ResetDependencies(id?: string) {
    if (!id) id = getActiveInstance();

    modals.openConfirmModal({
        title: <span className="text-lg font-bold">Reset Dependencies?</span>,
        centered: true,
        overlayProps: {
            blur: 2,
        },
        children: (
            <p>
                Are you sure you want to reset the dependencies for this
                instance? This will remove all dependencies and reinstall them,
                and may take some time.
            </p>
        ),
        confirmProps: {
            children: "Reset",
            color: "blue",
            variant: "light",
        },
        cancelProps: {
            children: "Cancel",
            color: "gray",
            variant: "light",
        },
        onConfirm: async () => {
            modals.open({
                title: (
                    <span className="text-lg font-bold">
                        Resetting Dependencies
                    </span>
                ),
                children: (
                    <p>
                        Resetting dependencies for instance {id}. This may take
                        some time.{" "}
                        <span className="text-red-500 font-bold">
                            Please do not close this window/page.
                        </span>
                    </p>
                ),
                withCloseButton: false,
                closeOnClickOutside: false,
                closeOnEscape: false,
                centered: true,
                overlayProps: {
                    blur: 2,
                },
            });

            try {
                await Stop(id);

                socket.emit("server:reset-dependencies", {
                    id,
                } as ResetDependenciesData);

                usePage.getState().setPage("home");

                socket.on("client:reset-dependencies", (result: string) => {
                    modals.closeAll();
                    notifications.show({
                        title: "Reset dependencies",
                        message: `Dependency reset complete. Result: ${result}`,
                        color: "blue",
                    });
                });
            } catch (e) {
                modals.closeAll();
                notifications.show({
                    title: "Failed to reset dependencies",
                    message: `Failed to reset dependencies: ${e}`,
                    color: "red",
                });
            }
        },
    });
}
