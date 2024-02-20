import CustomCard from "@/components/ui/CustomCard";
import { useInstance } from "@/hooks/useInstance";
import { useInstanceSettings } from "@/hooks/useInstanceSettings";
import { usePage } from "@/hooks/usePage";
import type { StorageInstance } from "@scm/types";
import socket from "@/utils/socket";
import {
    Button,
    Divider,
    NumberInput,
    ScrollArea,
    Switch,
    TextInput,
    Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useEffect } from "react";

export default function InstanceSettingsPage() {
    const activeInstance = useInstance((state) => state.activeInstance);
    const instanceSettings = useInstanceSettings(
        (state) => state.instanceSettings
    );
    const setInstanceSettings = useInstanceSettings(
        (state) => state.setInstanceSettings
    );
    const page = usePage((state) => state.page);
    const setPage = usePage((state) => state.setPage);

    useEffect(() => {
        if (page.id === "instance-settings") {
            socket.emit("server:fetch-instance-settings", activeInstance);
            socket.on(
                "client:fetch-instance-settings",
                (data: StorageInstance) => {
                    setInstanceSettings(data);

                    settingsForm.setValues({
                        autoStart: data.settings.autoStart || false,
                        autoUpdateEnabled:
                            data.settings.autoUpdate.enabled || false,
                        enableStartupWebhook:
                            data.settings.onStartup.enabled || false,
                        startupWebhookURL:
                            data.settings.onStartup.webhook || "",
                        startupWebhookMessage:
                            data.settings.onStartup.message || "",
                        crashDetectionEnabled:
                            data.settings.crashDetection.enabled || false,
                        crashDetectionWebhookURL:
                            data.settings.crashDetection.webhook || "",
                        crashDetectionWebhookMessage:
                            data.settings.crashDetection.message || "",
                        autoRestartEnabled:
                            data.settings.autoRestart.enabled || false,
                        maxRestarts: data.settings.autoRestart.maxRestarts || 0,
                    });
                }
            );

            socket.on("client:instance-settings-updated", (data) => {
                notifications.show({
                    title: "Instance Settings Updated",
                    message: `Instance settings have been updated.`,
                    color: "green",
                });
                setInstanceSettings(data);
            });

            return () => {
                socket.off("client:fetch-instance-settings");
                socket.off("client:instance-settings-updated");
            };
        }
    }, [page]);

    const settingsForm = useForm({
        initialValues: {
            autoStart: instanceSettings.settings.autoStart || false,
            autoUpdateEnabled: instanceSettings.settings.autoUpdate.enabled,
            enableStartupWebhook: instanceSettings.settings.onStartup.enabled,
            startupWebhookURL:
                instanceSettings.settings.onStartup.webhook || "",
            startupWebhookMessage:
                instanceSettings.settings.onStartup.message || "",
            crashDetectionEnabled:
                instanceSettings.settings.crashDetection.enabled,
            crashDetectionWebhookURL:
                instanceSettings.settings.crashDetection.webhook || "",
            crashDetectionWebhookMessage:
                instanceSettings.settings.crashDetection.message || "",
            autoRestartEnabled: instanceSettings.settings.autoRestart.enabled,
            maxRestarts: instanceSettings.settings.autoRestart.maxRestarts,
        },
    });

    function handleFormSubmit(values: typeof settingsForm.values) {
        socket.emit("server:update-instance-settings", {
            name: null,
            id: activeInstance,
            settings: {
                autoStart: values.autoStart,
                autoUpdate: {
                    enabled: values.autoUpdateEnabled,
                },
                onStartup: {
                    enabled: values.enableStartupWebhook,
                    webhook: values.startupWebhookURL,
                    message: values.startupWebhookMessage,
                },
                crashDetection: {
                    enabled: values.crashDetectionEnabled,
                    webhook: values.crashDetectionWebhookURL,
                    message: values.crashDetectionWebhookMessage,
                },
                autoRestart: {
                    enabled: values.autoRestartEnabled,
                    maxRestarts: values.maxRestarts,
                },
            },
        });

        setPage("home");
    }

    return (
        <>
            <ScrollArea className="w-full h-full">
                <div className="flex flex-col item-center gap-4 p-[1px]">
                    <CustomCard>
                        <form
                            className="flex flex-col gap-2"
                            onSubmit={settingsForm.onSubmit((values) =>
                                handleFormSubmit(values)
                            )}
                        >
                            <h1 className="text-2xl font-bold">Auto Start</h1>
                            <p className="text-xs text-muted">
                                Configure automatic start for this instance. If
                                enabled, the instance will build and start when
                                SnailyCAD Manager is started.
                            </p>

                            <Switch
                                label="Enable?&nbsp;&nbsp;"
                                {...settingsForm.getInputProps("autoStart", {
                                    type: "checkbox",
                                })}
                            />

                            <Divider className="my-2" />

                            <h1 className="text-2xl font-bold">Auto Updates</h1>
                            <p className="text-xs text-muted">
                                Configure automatic updates for this instance.
                            </p>

                            <Switch
                                label="Enable?&nbsp;&nbsp;"
                                {...settingsForm.getInputProps(
                                    "autoUpdateEnabled",
                                    {
                                        type: "checkbox",
                                    }
                                )}
                            />

                            <Divider className="my-2" />

                            <h1 className="text-2xl font-bold">
                                Startup Message
                            </h1>
                            <p className="text-xs text-muted">
                                Configure a webhook to be sent when the instance
                                starts.
                            </p>

                            <Switch
                                label="Enable?&nbsp;&nbsp;"
                                {...settingsForm.getInputProps(
                                    "enableStartupWebhook",
                                    {
                                        type: "checkbox",
                                    }
                                )}
                            />

                            <TextInput
                                label="Webhook URL"
                                placeholder="https://discord.com/api/webhooks/..."
                                {...settingsForm.getInputProps(
                                    "startupWebhookURL"
                                )}
                            />

                            <Textarea
                                label="Webhook Message"
                                placeholder="Instance has started!"
                                resize="vertical"
                                {...settingsForm.getInputProps(
                                    "startupWebhookMessage"
                                )}
                            />

                            <Divider className="my-2" />

                            <h1 className="text-2xl font-bold">
                                Crash Detection
                            </h1>
                            <p className="text-xs text-muted">
                                Configure a webhook to be sent when the instance
                                crashes.
                            </p>

                            <Switch
                                label="Enable?&nbsp;&nbsp;"
                                {...settingsForm.getInputProps(
                                    "crashDetectionEnabled",
                                    {
                                        type: "checkbox",
                                    }
                                )}
                            />

                            <TextInput
                                label="Webhook URL"
                                placeholder="https://discord.com/api/webhooks/..."
                                {...settingsForm.getInputProps(
                                    "crashDetectionWebhookURL"
                                )}
                            />

                            <Textarea
                                label="Webhook Message"
                                placeholder="Instance has crashed!"
                                resize="vertical"
                                {...settingsForm.getInputProps(
                                    "crashDetectionWebhookMessage"
                                )}
                            />

                            <Divider className="my-2" />

                            <h1 className="text-2xl font-bold">Auto Restart</h1>
                            <p className="text-xs text-muted">
                                Configure automatic restarts for this instance
                                if it crashes.
                            </p>

                            <Switch
                                label="Enable?&nbsp;&nbsp;"
                                {...settingsForm.getInputProps(
                                    "autoRestartEnabled",
                                    {
                                        type: "checkbox",
                                    }
                                )}
                            />

                            <NumberInput
                                label="Max Restarts"
                                min={0}
                                max={20}
                                placeholder="5"
                                {...settingsForm.getInputProps("maxRestarts")}
                            />

                            <Divider className="my-2" />
                            <div className="flex items-center justify-end">
                                <p className="text-xs text-muted mr-2">
                                    Done editing?
                                </p>
                                <Button variant="light" type="submit">
                                    Save
                                </Button>
                            </div>
                        </form>
                    </CustomCard>
                </div>
            </ScrollArea>
        </>
    );
}
