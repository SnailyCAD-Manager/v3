import CustomCard from "@/components/ui/CustomCard";
import { useInstance } from "@/hooks/useInstance";
import { usePage } from "@/hooks/usePage";
import { CommandData } from "@/types/socket";
import Start from "@/utils/controls/start";
import Stop from "@/utils/controls/stop";
import socket from "@/utils/socket";
import invalidTerminalCommands from "@/utils/terminal/invalid";
import {
    ActionIcon,
    Button,
    Card,
    Menu,
    TextInput,
    Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
    IconChevronRight,
    IconDotsVertical,
    IconDownload,
    IconPlayerPlay,
    IconReload,
    IconSquare,
} from "@tabler/icons-react";
import { useEffect, useRef } from "react";

export default function HomePage() {
    const clearLogs = useInstance((state) => state.clearLogs);
    const activeInstance = useInstance((state) => state.activeInstance);
    const setPage = usePage((state) => state.setPage);
    const instances = useInstance((state) => state.instances);
    const addLog = useInstance((state) => state.addLog);

    const activeInstanceData = instances.find(
        (instance) => instance.id === activeInstance
    );

    function downloadLogs() {
        const logs = activeInstanceData?.logs.join("\n");
        const element = document.createElement("a");
        const logOuput: string[] = [];

        logs?.split("\n").forEach((log) => {
            logOuput.push(
                log.replace(/<[^>]*>?/gm, "").replace(/&nbsp;/g, " ")
            );
        });

        element.setAttribute(
            "href",
            "data:text/plain;charset=utf-8," +
                encodeURIComponent(logOuput.join("\n") || "Empty Logs")
        );
        element.setAttribute("download", "manager-logs.txt");
        element.style.display = "none";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    const terminalRef = useRef<HTMLPreElement>(null);

    useEffect(() => {
        terminalRef.current?.scrollTo({
            top: terminalRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [activeInstanceData?.logs.length]);

    const commandForm = useForm({
        initialValues: {
            command: "",
        },
    });

    function handleCommandSubmit(values: typeof commandForm.values) {
        addLog(
            activeInstance,
            `<span style="color: rgba(255, 255, 255, 0.5);">> ${values.command}</span>`
        );

        if (
            invalidTerminalCommands.some((cmd) => values.command.includes(cmd))
        ) {
            addLog(
                activeInstance,
                `<span style="background-color: #ff0000; padding: 0 15px; color: white;">COMMAND NOT ALLOWED!</span>`
            );
            return commandForm.reset();
        }

        if (values.command === "cls" || values.command === "clear") {
            clearLogs(activeInstanceData?.id as string);
            addLog(activeInstance, "Logs cleared!");

            return commandForm.reset();
        }

        values.command !== "" &&
            socket.emit("server:command", {
                id: activeInstance,
                command: values.command,
            } as CommandData);
        commandForm.reset();
    }

    useEffect(() => {
        if (!activeInstance) {
            setPage("instance-selector");
        }
    }, [activeInstance]);

    return (
        <div className="flex flex-col gap-5 items-center justify-center w-full h-full">
            <CustomCard className="w-full">
                <div className="w-full h-full gap-2 flex flex-col items-center justify-center">
                    <h1 className="text-lg font-semibold text-center">
                        SnailyCAD Controls
                    </h1>
                    <div className="flex flex-row gap-2 items-center justify-center w-full">
                        {/* If both client and api are offline, show start, if both are online, show stop */}
                        {activeInstanceData?.status.client &&
                        activeInstanceData?.status.api ? (
                            <Button
                                leftSection={<IconSquare size={16} />}
                                variant="light"
                                color="orange"
                                onClick={() => Stop()}
                            >
                                Stop
                            </Button>
                        ) : (
                            <Button
                                leftSection={<IconPlayerPlay size={16} />}
                                variant="light"
                                color="green"
                                onClick={() => Start()}
                            >
                                Start
                            </Button>
                        )}
                        <Menu>
                            <Menu.Target>
                                <ActionIcon variant="default">
                                    <IconDotsVertical size={16} />
                                </ActionIcon>
                            </Menu.Target>

                            <Menu.Dropdown>
                                <Menu.Label>Instance Management</Menu.Label>
                                <Menu.Item
                                    leftSection={<IconReload />}
                                    disabled={
                                        !activeInstanceData?.status.client &&
                                        !activeInstanceData?.status.api
                                    }
                                >
                                    Restart Instance
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </div>
                </div>
            </CustomCard>
            <CustomCard className="h-full w-full flex flex-col gap-2">
                <h1 className="text-xl font-semibold text-center">
                    SnailyCAD Console
                </h1>
                <Card.Section p={12} className="h-full">
                    {/* Terminal Style */}
                    <div className="w-full h-full relative rounded-md bg-black/50">
                        <pre
                            ref={terminalRef}
                            className="absolute flex flex-col top-0 left-0 h-[calc(100%-2.5rem)] w-full p-2 overflow-hidden hover:overflow-y-auto whitespace-pre-wrap text-sm"
                        >
                            {activeInstanceData?.logs.map(
                                (log, index) =>
                                    index < 150 && (
                                        <span
                                            key={index}
                                            dangerouslySetInnerHTML={{
                                                __html: log,
                                            }}
                                        />
                                    )
                            )}
                        </pre>
                        <form
                            onSubmit={commandForm.onSubmit((values) =>
                                handleCommandSubmit(values)
                            )}
                        >
                            <TextInput
                                autoComplete="off"
                                variant="transparent"
                                className="w-full absolute bottom-0 left-0 h-[2.5rem]"
                                placeholder="Enter command..."
                                leftSection={<IconChevronRight size={16} />}
                                {...commandForm.getInputProps("command")}
                            />
                        </form>
                        <Tooltip label="Download logs" onClick={downloadLogs}>
                            <ActionIcon
                                className="absolute top-2 left-[calc(100%-2.2rem)]"
                                size={28}
                                variant="default"
                            >
                                <IconDownload size={16} />
                            </ActionIcon>
                        </Tooltip>
                    </div>
                </Card.Section>
            </CustomCard>
        </div>
    );
}
