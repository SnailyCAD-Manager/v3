import SpotlightActions from "@/utils/spotlight/spotlight";
import { Spotlight } from "@mantine/spotlight";
import { IconTerminal } from "@tabler/icons-react";

export default function SpotlightProvider() {
    return (
        <Spotlight
            actions={SpotlightActions}
            nothingFound="No actions found"
            highlightQuery
            searchProps={{
                placeholder: "Run an action...",
                autoFocus: true,
                leftSection: <IconTerminal />,
            }}
            shortcut={[
                "ctrl + k",
                "cmd + k",
                "ctrl + space",
                "cmd + space",
                "ctrl + p",
                "cmd + p",
                "/",
            ]}
        />
    );
}
