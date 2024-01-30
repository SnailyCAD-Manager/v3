import { getActiveInstance } from "@/hooks/useInstance";
import { modals } from "@mantine/modals";
import socket from "../socket";
import { DeleteData } from "@scm/types";
import { useInstance } from "../../hooks/useInstance";
import { usePage } from "@/hooks/usePage";

export default function Delete(id?: string) {
    if (!id) id = getActiveInstance();

    modals.openConfirmModal({
        title: <h1 className="text-lg font-bold">Delete Instance: {id}?</h1>,
        children: (
            <>
                <p>
                    Are you sure you would like to delete instance <b>{id}</b>?
                </p>
                <p className="text-red-500 font-semibold">
                    THIS ACTION CANNOT BE UNDONE
                </p>
            </>
        ),
        centered: true,
        overlayProps: {
            blur: 5,
        },
        confirmProps: {
            children: "Delete",
            color: "red",
            variant: "light",
        },
        cancelProps: {
            children: "Cancel",
            variant: "light",
        },
        onConfirm: () => {
            useInstance.getState().setInstanceDeletionInProgress(true);
            usePage.getState().setPage("instance-selector");

            socket.emit("server:delete-instance", {
                id,
            } as DeleteData);
        },
    });
}
