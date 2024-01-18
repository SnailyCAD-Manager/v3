import { modals } from "@mantine/modals";

interface Props {
    instanceName: string;
    instanceId: string;
}

export default function DeleteInstanceModal(props: Props) {
    modals.openConfirmModal({
        title: <h1 className="text-lg font-semibold">Delete Instance</h1>,
        centered: true,
        overlayProps: {
            blur: 5,
        },
        children: (
            <div className="flex flex-col gap-2">
                <div>
                    Are you sure you want to delete{" "}
                    <span className="font-semibold">{props.instanceName}</span>?
                </div>
                <div className="text-orange-500">
                    This will delete all data associated with this instance.
                </div>
            </div>
        ),
        confirmProps: {
            variant: "light",
            color: "red",
            children: "Confirm Delete",
        },
        cancelProps: {
            variant: "light",
            color: "blue",
            children: "Cancel",
        },
    });
}
