import { Button, Menu } from "@mantine/core";
import CustomCard from "./CustomCard";
import { useInstance } from "@/hooks/useInstance";
import { usePage } from "@/hooks/usePage";
import {
    IconArrowRight,
    IconChevronDown,
    IconPlayerPlay,
    IconPlayerStop,
    IconRefresh,
    IconRefreshAlert,
    IconTrash,
} from "@tabler/icons-react";
import RestartInstanceModal from "@/utils/modals/restartInstance";

interface Props {
    name: string;
    id: string;
}

export default function InstanceCard(props: Props) {
    const setActiveInstance = useInstance((state) => state.setActiveInstance);
    const activeInstance = useInstance((state) => state.activeInstance);
    const instances = useInstance((state) => state.instances);
    const { setPage } = usePage();

    function selectInstance() {
        setActiveInstance(props.id);
        setPage("home");
    }

    function getInstanceStatus(): "offline" | "partial" | "online" {
        const instance = instances.find((i) => i.id === props.id);
        /* 
            status: {
                api: boolean;
                client: boolean;
            }

            If both the Client and API are online, return online.
            If both the Client and API are offline, return offline.
            If one is on and the other is off, return partial.
        */

        if (instance?.status.api && instance?.status.client) {
            return "online";
        }

        if (!instance?.status.api && !instance?.status.client) {
            return "offline";
        }

        return "partial";
    }

    return (
        <>
            <CustomCard
                className={`${
                    activeInstance === props.id && "!outline !outline-blue-500"
                }`}
            >
                <div className="w-full h-full flex flex-row gap-2 items-center">
                    <div
                        className={`w-3 h-3 rounded-full ${
                            getInstanceStatus() === "online"
                                ? "!bg-green-500"
                                : getInstanceStatus() === "partial"
                                  ? "!bg-yellow-500"
                                  : "!bg-red-500"
                        }`}
                    />
                    <h1 className="text-lg font-semibold">{props.name}</h1>
                    <div className="flex-grow" />
                    <Button.Group>
                        <Button
                            variant="light"
                            color="blue"
                            onClick={selectInstance}
                        >
                            Select
                        </Button>
                        <Menu position="bottom-end">
                            <Menu.Target>
                                <Button
                                    variant="light"
                                    className="!px-2 !border-l-2"
                                >
                                    <IconChevronDown size={16} />
                                </Button>
                            </Menu.Target>

                            <Menu.Dropdown>
                                <Menu.Label>Instance Management</Menu.Label>
                                <Menu.Item
                                    leftSection={<IconArrowRight size={16} />}
                                    onClick={selectInstance}
                                >
                                    Select Instance
                                </Menu.Item>
                                <Menu.Item
                                    leftSection={<IconPlayerPlay size={16} />}
                                >
                                    Start Instance
                                </Menu.Item>
                                <Menu.Item
                                    leftSection={<IconRefresh size={16} />}
                                    onClick={() =>
                                        RestartInstanceModal({
                                            instanceName: props.name,
                                            instanceId: props.id,
                                        })
                                    }
                                >
                                    Restart Instance
                                </Menu.Item>
                                <Menu.Divider />
                                <Menu.Label>Danger Area</Menu.Label>
                                <Menu.Item
                                    leftSection={<IconPlayerStop size={16} />}
                                    color="yellow"
                                >
                                    Force Stop Instance
                                </Menu.Item>
                                <Menu.Item
                                    leftSection={<IconRefreshAlert size={16} />}
                                    color="orange"
                                >
                                    Reinstall Instance
                                </Menu.Item>
                                <Menu.Item
                                    leftSection={<IconTrash size={16} />}
                                    color="red"
                                >
                                    Delete Instance
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </Button.Group>
                </div>
            </CustomCard>
        </>
    );
}
