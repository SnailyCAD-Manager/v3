import CustomCard from "@/components/ui/CustomCard";
import { useInstance } from "@/hooks/useInstance";
import { Env } from "@/types/env";
import {
    ActionIcon,
    Alert,
    Button,
    Divider,
    ScrollArea,
    TextInput,
    Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconDeviceFloppy, IconDownload } from "@tabler/icons-react";

export default function EnvEditorPage() {
    const { activeInstanceData } = useInstance();

    const envForm = useForm({
        initialValues: {
            CORS_ORIGIN_URL: activeInstanceData?.env.CORS_ORIGIN_URL,
            DB_HOST: activeInstanceData?.env.DB_HOST,
            DB_PORT: activeInstanceData?.env.DB_PORT,
            DISCORD_BOT_TOKEN: activeInstanceData?.env.DISCORD_BOT_TOKEN,
            DISCORD_CLIENT_ID: activeInstanceData?.env.DISCORD_CLIENT_ID,
            DISCORD_CLIENT_SECRET:
                activeInstanceData?.env.DISCORD_CLIENT_SECRET,
            DISCORD_SERVER_ID: activeInstanceData?.env.DISCORD_SERVER_ID,
            DOMAIN: activeInstanceData?.env.DOMAIN,
            ENCRYPTION_TOKEN: activeInstanceData?.env.ENCRYPTION_TOKEN,
            JWT_SECRET: activeInstanceData?.env.JWT_SECRET,
            NEXT_PUBLIC_CLIENT_URL:
                activeInstanceData?.env.NEXT_PUBLIC_CLIENT_URL,
            NEXT_PUBLIC_PROD_ORIGIN:
                activeInstanceData?.env.NEXT_PUBLIC_PROD_ORIGIN,
            PORT_API: activeInstanceData?.env.PORT_API,
            PORT_CLIENT: activeInstanceData?.env.PORT_CLIENT,
            POSTGRES_DB: activeInstanceData?.env.POSTGRES_DB,
            POSTGRES_PASSWORD: activeInstanceData?.env.POSTGRES_PASSWORD,
            POSTGRES_USER: activeInstanceData?.env.POSTGRES_USER,
            SECURE_COOKIES_FOR_IFRAME:
                activeInstanceData?.env.SECURE_COOKIES_FOR_IFRAME,
            STEAM_API_KEY: activeInstanceData?.env.STEAM_API_KEY,
        } as Env,
    });

    // function handleSubmit() {}
    function handleDownloadEnv() {
        const env = Object.entries(envForm.values)
            .map(([key, value]) => `${key}="${value}"`)
            .join("\n");

        // Download it as a txt file
        const element = document.createElement("a");
        const file = new Blob([env], { type: "text/plain" });
        element.href = URL.createObjectURL(file);
        element.download = "manager-env.txt";
        document.body.appendChild(element);
        element.click();
    }
    return (
        <form className="w-full h-full">
            <CustomCard className="w-full h-full flex flex-col items-center">
                {/* Header (Just a title with a download button on the right) */}
                <div className="w-full flex flex-row items-center justify-between">
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
                <Divider className="mt-3 h-0.5 bg-neutral-500 w-full" />
                {/* Form */}
                <ScrollArea className="w-full h-full">
                    <div className="w-full h-full flex flex-col gap-2 mt-3">
                        {Object.entries(envForm.values).map(([key], index) => (
                            <TextInput
                                key={index}
                                label={key}
                                className="w-full"
                                required
                                {...envForm.getInputProps(key)}
                            />
                        ))}
                    </div>
                </ScrollArea>
                {/* Footer (Just a save button) */}
                <div className="w-full flex flex-row items-center justify-end gap-2 mt-3">
                    <Alert>
                        <b>WARNING</b>&nbsp;Editing the ENV can cause issues
                    </Alert>
                    <Button
                        variant="light"
                        color="blue"
                        leftSection={<IconDeviceFloppy size={16} />}
                    >
                        Save
                    </Button>
                </div>
            </CustomCard>
        </form>
    );
}
