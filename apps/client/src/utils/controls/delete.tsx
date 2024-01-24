import { getActiveInstance } from "@/hooks/useInstance";
import { modals } from "@mantine/modals";

export default function Delete() {
    const id = getActiveInstance();

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
        confirmProps: {
            children: "Delete",
            color: "red",
            variant: "light",
        },
        cancelProps: {
            children: "Cancel",
            variant: "light",
        },
    });
}
