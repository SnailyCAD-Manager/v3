import CustomCard from "@/components/ui/CustomCard";
import { Button, Modal, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";

export default function ToolsPage() {
    const [webhookModalOpened, setWebhookModalOpened] = useState(false);

    const webhookForm = useForm({
        initialValues: {
            statusWebhook: "",
            crashWebhook: "",
            logsWebhook: "",
        },
        validate: {
            statusWebhook: (value) => {
                const regex = /discord.com\/api\/webhooks\/([^/]+)\/([^/]+)/;
                const isValid = regex.test(value);
                if (!isValid) {
                    return "Invalid webhook URL";
                }
                return null;
            },
            crashWebhook: (value) => {
                const regex = /discord.com\/api\/webhooks\/([^/]+)\/([^/]+)/;
                const isValid = regex.test(value);
                if (!isValid) {
                    return "Invalid webhook URL";
                }
                return null;
            },
            logsWebhook: (value) => {
                const regex = /discord.com\/api\/webhooks\/([^/]+)\/([^/]+)/;
                const isValid = regex.test(value);
                if (!isValid) {
                    return "Invalid webhook URL";
                }
                return null;
            },
        },
    });

    function handleWebhookSubmit(values: typeof webhookForm.values) {
        console.log(values);
    }

    return (
        <>
            <div className="w-full h-full">
                <div className="flex flex-col items-center justify-center w-full h-full p-4">
                    <div className="flex flex-row items-center justify-center w-full h-16">
                        <h1 className="text-3xl font-bold">General Tools</h1>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <CustomCard>
                            <h1 className="text-lg font-bold">
                                Reset Node Modules
                            </h1>
                            <p className="text-sm text-muted">
                                In some cases, SnailyCAD can run into issues
                                with node modules. This tool will reset your
                                node modules and reinstall them for you.
                            </p>
                            <Button className="mt-4" variant="light" fullWidth>
                                Reset Node Modules
                            </Button>
                        </CustomCard>
                        <CustomCard>
                            <h1 className="text-lg font-bold">
                                Discord Webhook Settings
                            </h1>
                            <p className="text-sm text-muted">
                                Configure Discord webhooks for your CAD.
                                Webhooks can be used for logging the status of
                                your CAD, crash reports, and more.
                            </p>
                            <Button
                                className="mt-4"
                                variant="light"
                                fullWidth
                                onClick={() => setWebhookModalOpened(true)}
                            >
                                Configure Webhooks
                            </Button>
                        </CustomCard>
                    </div>
                </div>
            </div>

            <Modal
                opened={webhookModalOpened}
                onClose={() => setWebhookModalOpened(false)}
                centered
                title={
                    <h1 className="text-lg font-bold">Configure Webhooks</h1>
                }
            >
                <form
                    onSubmit={webhookForm.onSubmit(handleWebhookSubmit)}
                    className="flex flex-col gap-2"
                >
                    <TextInput
                        label={
                            <div className="flex flex-row gap-1">
                                <span>Status Webhooks</span>
                                <span className="text-muted font-normal">
                                    {"(Optional)"}
                                </span>
                            </div>
                        }
                        description="This webhook will be used to send status updates to your Discord server."
                        {...webhookForm.getInputProps("statusWebhook")}
                    />
                    <TextInput
                        label={
                            <div className="flex flex-row gap-1">
                                <span>Crash Webhook</span>
                                <span className="text-muted font-normal">
                                    {"(Optional)"}
                                </span>
                            </div>
                        }
                        description="This webhook will be used to send crash reports to your Discord server."
                        {...webhookForm.getInputProps("crashWebhook")}
                    />
                    <TextInput
                        label={
                            <div className="flex flex-row gap-1">
                                <span>Logs Webhook</span>
                                <span className="text-muted font-normal">
                                    {"(Optional)"}
                                </span>
                            </div>
                        }
                        description="This webhook will be used to send logs to your Discord server."
                        {...webhookForm.getInputProps("logsWebhook")}
                    />

                    <div className="flex flex-row items-center justify-end w-full">
                        <Button
                            className="ml-4"
                            type="submit"
                            variant="light"
                            color="blue"
                        >
                            Save
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
}
