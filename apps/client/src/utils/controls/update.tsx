import { getActiveInstance } from "@/hooks/useInstance";
import { useUpdate } from "@/hooks/useUpdate";
import { modals } from "@mantine/modals";
import socket from "../socket";
import { UpdateData } from "@scm/types";

export default function Update(id?: string) {
    // Stable update
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
                id: id || getActiveInstance(),
                force: false,
            } as UpdateData);
        },
    });
}
