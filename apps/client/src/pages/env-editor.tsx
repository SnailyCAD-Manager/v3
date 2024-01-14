import CustomCard from "@/components/ui/CustomCard";
import { useInstance } from "@/hooks/useInstance";
import { Env } from "@/types/env";
import SaveEnv from "@/utils/controls/env";
import {
    ActionIcon,
    Alert,
    Button,
    ScrollArea,
    TextInput,
    Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconDeviceFloppy, IconDownload } from "@tabler/icons-react";
import invalidValues from "../utils/env/invalidValues";

export default function EnvEditorPage() {
    const activeInstanceData = useInstance((state) => state.activeInstanceData);

    const envForm = useForm({
        initialValues: {
            POSTGRES_USER: activeInstanceData?.env.POSTGRES_USER,
            POSTGRES_PASSWORD: activeInstanceData?.env.POSTGRES_PASSWORD,
            POSTGRES_DB: activeInstanceData?.env.POSTGRES_DB,
            DB_HOST: activeInstanceData?.env.DB_HOST,
            DB_PORT: activeInstanceData?.env.DB_PORT,
            JWT_SECRET: activeInstanceData?.env.JWT_SECRET,
            CORS_ORIGIN_URL: activeInstanceData?.env.CORS_ORIGIN_URL,
            NEXT_PUBLIC_CLIENT_URL:
                activeInstanceData?.env.NEXT_PUBLIC_CLIENT_URL,
            NEXT_PUBLIC_PROD_ORIGIN:
                activeInstanceData?.env.NEXT_PUBLIC_PROD_ORIGIN,
            PORT_API: activeInstanceData?.env.PORT_API,
            PORT_CLIENT: activeInstanceData?.env.PORT_CLIENT,
            ENCRYPTION_TOKEN: activeInstanceData?.env.ENCRYPTION_TOKEN,
            DOMAIN: activeInstanceData?.env.DOMAIN,
            SECURE_COOKIES_FOR_IFRAME:
                activeInstanceData?.env.SECURE_COOKIES_FOR_IFRAME,
            DISCORD_CLIENT_ID: activeInstanceData?.env.DISCORD_CLIENT_ID,
            DISCORD_CLIENT_SECRET:
                activeInstanceData?.env.DISCORD_CLIENT_SECRET,
            DISCORD_BOT_TOKEN: activeInstanceData?.env.DISCORD_BOT_TOKEN,
            DISCORD_SERVER_ID: activeInstanceData?.env.DISCORD_SERVER_ID,
            STEAM_API_KEY: activeInstanceData?.env.STEAM_API_KEY,
        } as Env,

        validate: {
            CORS_ORIGIN_URL: (value) => {
                if (
                    invalidValues.CORS_ORIGIN_URL.some(
                        (v) => v.includes?.some((i) => value?.includes(i))
                    )
                ) {
                    return invalidValues.CORS_ORIGIN_URL.find(
                        (v) => v.includes?.some((i) => value?.includes(i))
                    )?.reason;
                } else {
                    return null;
                }
            },
            NEXT_PUBLIC_CLIENT_URL: (value) => {
                if (
                    invalidValues.NEXT_PUBLIC_CLIENT_URL.some(
                        (v) => v.includes?.some((i) => value?.includes(i))
                    )
                ) {
                    return invalidValues.NEXT_PUBLIC_CLIENT_URL.find(
                        (v) => v.includes?.some((i) => value?.includes(i))
                    )?.reason;
                } else {
                    return null;
                }
            },
            NEXT_PUBLIC_PROD_ORIGIN: (value) => {
                if (
                    invalidValues.NEXT_PUBLIC_PROD_ORIGIN.some(
                        (v) => v.includes?.some((i) => value?.includes(i))
                    )
                ) {
                    return invalidValues.NEXT_PUBLIC_PROD_ORIGIN.find(
                        (v) => v.includes?.some((i) => value?.includes(i))
                    )?.reason;
                } else {
                    return null;
                }
            },
        },
    });

    function handleDownloadEnv() {
        const env = Object.entries(envForm.values)
            .map(([key, value]) => `${key}="${value}"`)
            .join("\n");

        const element = document.createElement("a");
        const file = new Blob([env], { type: "text/plain" });
        element.href = URL.createObjectURL(file);
        element.download = "manager-env.txt";
        document.body.appendChild(element);
        element.click();
    }

    function handleSaveEnv(values: typeof envForm.values) {
        SaveEnv(values);
    }

    return (
        <form
            className="w-full h-full"
            onSubmit={envForm.onSubmit((values) => handleSaveEnv(values))}
        >
            <CustomCard className="w-full h-full flex flex-col items-center">
                {/* Header (Just a title with a download button on the right) */}
                <div className="w-full flex flex-row items-center justify-between border-b border-b-neutral-500 pb-3">
                    <h1 className="text-xl font-semibold">Env Editor</h1>
                    <Tooltip label="Download ENV">
                        <ActionIcon
                            variant="default"
                            onClick={handleDownloadEnv}
                        >
                            <IconDownload size={16} />
                        </ActionIcon>
                    </Tooltip>
                </div>
                {/* Form */}
                <ScrollArea className="w-full h-full">
                    <div className="w-full h-full flex flex-col gap-2 mt-3 mb-3">
                        {Object.entries(envForm.values).map(([key], index) => (
                            <TextInput
                                key={index}
                                label={key}
                                className="w-full"
                                {...envForm.getInputProps(key)}
                            />
                        ))}
                    </div>
                </ScrollArea>
                {/* Footer (Just a save button) */}
                <div className="w-full flex flex-row items-center justify-end gap-2 border-t-neutral-500 border-t pt-3">
                    <Alert>
                        <b>WARNING</b>&nbsp;Editing the ENV can cause issues
                    </Alert>
                    <Button
                        variant="light"
                        color="blue"
                        leftSection={<IconDeviceFloppy size={16} />}
                        type="submit"
                    >
                        Save
                    </Button>
                </div>
            </CustomCard>
        </form>
    );
}
