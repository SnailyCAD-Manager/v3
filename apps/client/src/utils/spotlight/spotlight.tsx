import { SpotlightActionData } from "@mantine/spotlight";
import Controls from "../controls";
import { IconPlayerPlay } from "@tabler/icons-react";

const SpotlightActions: SpotlightActionData[] = [
    {
        id: "start",
        label: "Start SnailyCAD",
        description: "Start the currently selected instance of SnailyCAD",
        leftSection: <IconPlayerPlay size={16} />,
        onClick: () => {
            Controls.Start();
        },
    },
];

export default SpotlightActions;
