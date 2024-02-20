import { getActiveInstance, useInstance } from "@/hooks/useInstance";
import { useUpdate } from "@/hooks/useUpdate";
import { modals } from "@mantine/modals";
import socket from "../socket";
import type { UpdateData } from "@scm/types";
import Stop from "./stop";
import { notifications } from "@mantine/notifications";

export default async function Update(id?: string) {
    if (!id) id = getActiveInstance();
    const instanceData = useInstance
        .getState()
        .instances.find((i) => i.id === id);

    if (instanceData?.status.api || instanceData?.status.client) {
        const attemptingStop = notifications.show({
            title: "Stopping instance...",
            message: "Attempting to stop instance...",
            loading: true,
            autoClose: false,
        });
        await Stop(id);

        notifications.update({
            id: attemptingStop,
            title: "Stopped instance",
            message: "Successfully stopped instance.",
            loading: false,
            autoClose: true,
        });
    }

    modals.openConfirmModal({
        title: <span className="text-lg font-bold">Update SnailyCAD?</span>,
        centered: true,
        overlayProps: {
            blur: 2,
        },
        children: (
            <p>
                Are you sure you want to update SnailyCAD? This will update
                SnailyCAD to the latest stable release.
            </p>
        ),
        confirmProps: {
            children: "Update",
            color: "blue",
            variant: "light",
        },
        cancelProps: {
            children: "Cancel",
            color: "gray",
            variant: "light",
        },
        onConfirm: () => {
            useUpdate.getState().setInProgress(id || getActiveInstance(), true);
            socket.emit("server:update-instance", {
                id: id,
                force: false,
            } as UpdateData);
        },
    });
}
