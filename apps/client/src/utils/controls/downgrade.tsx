import { Select } from "@mantine/core";
import { modals } from "@mantine/modals";

export default function Downgrade() {
    modals.openConfirmModal({
        title: <span className="text-lg font-bold">Downgrade SnailyCAD</span>,
        children: <Select label="Select Version" />,
        centered: true,
        confirmProps: {
            variant: "light",
            children: "Downgrade",
        },
        cancelProps: {
            variant: "light",
            children: "Cancel",
            color: "red",
        },
    });
}
