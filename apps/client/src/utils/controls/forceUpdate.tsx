import { getActiveInstance } from "@/hooks/useInstance";
import { useUpdate } from "@/hooks/useUpdate";
import { modals } from "@mantine/modals";
import type { UpdateData } from "@scm/types";
import socket from "../socket";

export default function forceUpdate() {
    modals.openConfirmModal({
        title: <span className="text-lg font-bold">Force Update?</span>,
        centered: true,
        overlayProps: {
            blur: 2,
        },
        children: (
            <p>
                Are you sure you want to force update SnailyCAD? This will
                update SnailyCAD to the latest commit.{" "}
                <span className="text-orange-500">
                    This may be unstable. Please proceed with caution.
                </span>
            </p>
        ),
        confirmProps: {
            children: "Force Update",
            color: "orange",
            variant: "light",
        },
        cancelProps: {
            children: "Cancel",
            color: "gray",
            variant: "light",
        },
        onConfirm: () => {
            useUpdate.getState().setInProgress(getActiveInstance(), true);
            socket.emit("server:update-instance", {
                id: getActiveInstance(),
                force: true,
            } as UpdateData);
        },
    });
}
