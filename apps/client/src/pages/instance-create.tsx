import CustomCard from "@/components/ui/CustomCard";
import { usePage } from "@/hooks/usePage";
import socket from "@/utils/socket";
import {
    Button,
    Checkbox,
    Code,
    Loader,
    LoadingOverlay,
    TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconDownload } from "@tabler/icons-react";
import { useEffect, useState } from "react";

export default function InstanceCreatePage() {
    const form = useForm({
        initialValues: {
            name: "",
            id: "",
            useExisting: false,
            existingPath: "",
        },
        validate: {
            id: (value) =>
                /^[a-z0-9-]+$/.test(value)
                    ? null
                    : "Instance ID can only contain lowercase letters, numbers, and dashes",
        },
    });

    function handleSubmit(values: typeof form.values) {
        socket.emit("server:create-instance", values);

        setInstanceInfo({
            name: values.name,
            id: values.id,
        });

        setLoading({
            message: "Creating Instance...",
            state: true,
        });

        form.reset();
    }

    const { setPage } = usePage();

    type LoadingState = {
        message: string;
        messageType?: "info" | "success" | "warning" | "error";
        state: boolean;
    };

    const [loading, setLoading] = useState<LoadingState>({
        message: "",
        messageType: "info",
        state: false,
    });

    const [instanceInfo, setInstanceInfo] = useState<{
        name: string;
        id: string;
        useExisting?: boolean;
        existingPath?: string;
    }>({
        name: "",
        id: "",
        useExisting: false,
        existingPath: "",
    });

    const [logs, setLogs] = useState<string[]>([]);

    useEffect(() => {
        socket.on("create-instance-fail", (error: string) => {
            notifications.show({
                title: "Error creating instance",
                message: error,
                color: "red",
            });

            setLogs((logs) => [...logs, error]);

            setLoading({
                message: "",
                state: false,
            });
        });

        socket.on("create-instance-success", () => {
            notifications.show({
                title: "Instance Created",
                message: `Your instance ${instanceInfo.name} has been created successfully!`,
                color: "green",
            });
            setPage("instance-selector");

            setLoading({
                message: "",
                state: false,
            });

            setLogs((logs) => [...logs, "Instance created successfully!"]);
        });

        socket.on("create-instance-stdout", (data: string) => {
            setLoading({
                state: true,
                messageType: "info",
                message: data,
            });

            setLogs((logs) => [...logs, data]);
        });

        socket.on("create-instance-stderr", (data: string) => {
            setLoading({
                state: true,
                messageType: "warning",
                message: data,
            });

            setLogs((logs) => [...logs, data]);
        });

        return () => {
            socket.off("create-instance-fail");
            socket.off("create-instance-success");
            socket.off("create-instance-stdout");
            socket.off("create-instance-stderr");
        };
    }, []);

    function downloadCreateLogs() {
        const element = document.createElement("a");
        const file = new Blob(logs.length > 0 ? logs : ["Logs Empty"], {
            type: "text/plain;charset=utf-8",
        });
        element.href = URL.createObjectURL(file);
        element.download = `create-instance-${instanceInfo.name}-logs.log`;
        document.body.appendChild(element);
        element.click();
    }

    return (
        <div className="w-full h-full flex flex-col gap-2 items-center justify-center">
            <CustomCard className="w-full md:w-1/2 lg:w-1/4 xl:w-1/4">
                <LoadingOverlay
                    visible={loading.state}
                    overlayProps={{
                        blur: 2,
                    }}
                    loaderProps={{
                        children: (
                            <span
                                className={`w-full flex flex-col items-center justify-center gap-2`}
                            >
                                <h1 className="text-lg font-semibold">
                                    Creating Instance {instanceInfo.name}
                                </h1>
                                <Loader size={32} color="white" />
                                <Code
                                    className="!bg-neutral-800 !mx-2 whitespace-pre-wrap"
                                    component={"pre"}
                                >
                                    {loading.message}
                                </Code>
                                <span className="text-red-500 text-sm font-bold">
                                    DO NOT CLOSE THIS TAB
                                </span>
                            </span>
                        ),
                    }}
                />
                <form
                    onSubmit={form.onSubmit((values) => handleSubmit(values))}
                    className={`flex flex-col items-center justify-center gap-2`}
                >
                    <h1 className="text-xl font-semibold">
                        Create an Instance
                    </h1>

                    <TextInput
                        label="Instance Name"
                        description="A readable name for your instance, this will be shown throughout the manager."
                        className="w-full"
                        required
                        autoFocus
                        autoComplete="off"
                        disabled={loading.state}
                        {...form.getInputProps("name")}
                    />
                    <TextInput
                        label="Instance ID"
                        description="A unique ID for your instance, this will be used to identify your instance."
                        className="w-full"
                        required
                        autoComplete="off"
                        disabled={loading.state}
                        {...form.getInputProps("id")}
                    />
                    <Checkbox
                        label="Use Existing Instance?&nbsp;"
                        className="w-full"
                        {...form.getInputProps("useExisting", {
                            type: "checkbox",
                        })}
                        onChange={(e) => {
                            form.setFieldValue("useExisting", e.target.checked);
                        }}
                    />
                    {form.values.useExisting && (
                        <TextInput
                            label="Absolute Path to Existing Instance"
                            description="The ABSOLUTE path to the existing instance you want to use."
                            className="w-full"
                            required
                            autoComplete="off"
                            disabled={loading.state}
                            {...form.getInputProps("existingPath")}
                        />
                    )}
                    <div className="flex flex-row w-full justify-end gap-2">
                        <Button
                            variant="light"
                            color="red"
                            onClick={() => {
                                setPage("instance-selector");
                            }}
                        >
                            Cancel
                        </Button>
                        <Button variant="light" color="green" type="submit">
                            Create
                        </Button>
                    </div>
                </form>
            </CustomCard>
            <Button
                variant="default"
                size="xs"
                leftSection={<IconDownload size={12} />}
                onClick={downloadCreateLogs}
            >
                Download Creation Logs
            </Button>
        </div>
    );
}
