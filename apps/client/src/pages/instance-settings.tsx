import CustomCard from "@/components/ui/CustomCard";
import { useInstance } from "@/hooks/useInstance";
import { useInstanceSettings } from "@/hooks/useInstanceSettings";
import { usePage } from "@/hooks/usePage";
import { StorageInstance } from "@/types/instance";
import socket from "@/utils/socket";
import { Button, Divider, ScrollArea, Switch } from "@mantine/core";
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

    useEffect(() => {
        if (page.id === "instance-settings") {
            socket.emit("server:fetch-instance-settings", activeInstance);

            return () => {
                socket.on(
                    "client:fetch-instance-settings",
                    (data: StorageInstance) => {
                        setInstanceSettings(data);
                    }
                );

                socket.off("client:fetch-instance-settings");
            };
        }
    }, [page]);

    return (
        <>
            <ScrollArea className="w-full h-full">
                <div className="flex flex-col item-center gap-4 p-[1px]">
                    <CustomCard>
                        <form className="flex flex-col gap-2">
                            <h1 className="text-2xl font-bold">
                                Startup Settings
                            </h1>
                            <p className="text-xs text-muted">
                                Want to send a Discord Webhook when your
                                instance starts? This is the place to do it!
                            </p>

                            <Switch
                                label="Enable Discord Webhook&nbsp;&nbsp;"
                                labelPosition="right"
                            />

                            <Divider className="mt-2" />
                            {/* Bottom Right Save Button */}
                            <div className="flex items-center justify-end mt-2">
                                <p className="text-xs text-muted mr-2">
                                    Done editing?
                                </p>
                                <Button variant="light">Save</Button>
                            </div>
                        </form>
                    </CustomCard>
                </div>
            </ScrollArea>
        </>
    );
}
