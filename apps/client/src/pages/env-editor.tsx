import { useInstance } from "@/hooks/useInstance";
import { Env } from "@/types/env";
import { Alert, Button, Card, ScrollArea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconDeviceFloppy } from "@tabler/icons-react";

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

    function handleSubmit() {}
    return (
        <form className="h-full flex flex-col justify-center gap-3 bg-neutral-900 rounded-md outline outline-1 outline-neutral-800">
            <h1 className="text-xl font-semibold px-4 py-2 pb-0">ENV Editor</h1>
            <div className="w-full h-full relative flex flex-col items-center justify-center gap-3 overflow-y-auto border-solid border-t-2 border-t-neutral-800">
                <div className="flex flex-col items-center justify-center gap-3 absolute top-0 w-full p-3">
                    {Object.entries(envForm.values).map(([key, value]) => (
                        <TextInput
                            key={key}
                            label={key}
                            value={value as string}
                            className="w-full"
                            onChange={(e) =>
                                envForm.setFieldValue(
                                    key,
                                    e.currentTarget.value
                                )
                            }
                        />
                    ))}
                </div>
            </div>
            <div className="flex flex-row items-center justify-end gap-3 px-4 py-2 border-t-2 border-t-neutral-800">
                <Alert color="orange" className="text-xs">
                    <b>Warning:</b>&nbsp; Changing these values can cause issues
                    with your SnailyCAD instance. Please be careful, and consult
                    the documentation.
                </Alert>
                <Button
                    variant="light"
                    leftSection={<IconDeviceFloppy size={16} />}
                >
                    Save
                </Button>
            </div>
        </form>
    );
}
