import CustomCard from "@/components/ui/CustomCard";
import { usePage } from "@/hooks/usePage";
import socket from "@/utils/socket";
import { Button, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useEffect } from "react";

export default function InstanceCreatePage() {
    const form = useForm({
        initialValues: {
            name: "",
            id: "",
        },
        validate: {
            id: (value) =>
                /^[a-z0-9-]+$/.test(value)
                    ? null
                    : "Instance ID can only contain lowercase letters, numbers, and dashes",
        },
    });

    function handleSubmit(values: typeof form.values) {
        socket.emit("create-instance", values);
    }

    const { setPage } = usePage();

    useEffect(() => {
        socket.on("create-instance-fail", (error: string) => {
            notifications.show({
                title: "Error creating instance",
                message: error,
                color: "red",
            });
        });

        socket.on("create-instance-success", () => {
            notifications.show({
                title: "Instance Created",
                message: `Your instance ${form.values.name} has been created successfully!`,
                color: "green",
            });
            setPage("instance-selector");
        });

        return () => {
            socket.off("create-instance-fail");
        };
    }, []);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <CustomCard className="w-full md:w-1/2 lg:w-1/4 xl:w-1/4">
                <form
                    onSubmit={form.onSubmit((values) => handleSubmit(values))}
                    className="flex flex-col items-center justify-center gap-2"
                >
                    <h1 className="text-xl font-semibold">
                        Create an Instance
                    </h1>

                    <TextInput
                        label="Instance Name"
                        description="A readable name for your instance, this will be shown throughout the manager."
                        className="w-full"
                        required
                        {...form.getInputProps("name")}
                    />
                    <TextInput
                        label="Instance ID"
                        description="A unique ID for your instance, this will be used to identify your instance."
                        className="w-full"
                        required
                        {...form.getInputProps("id")}
                    />
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
        </div>
    );
}
