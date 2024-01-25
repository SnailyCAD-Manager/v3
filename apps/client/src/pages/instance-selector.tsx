import CustomCard from "@/components/ui/CustomCard";
import InstanceCard from "@/components/ui/InstanceCard";
import { useInstance } from "@/hooks/useInstance";
import { usePage } from "@/hooks/usePage";
import { Button, ScrollArea, Loader, LoadingOverlay } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";

export default function InstanceSelector() {
    const instances = useInstance((state) => state.instances);
    const instancesLoaded = useInstance((state) => state.instancesLoaded);
    const instanceDeletionInProgress = useInstance(
        (state) => state.instanceDeletionInProgress
    );
    const setPage = usePage((state) => state.setPage);
    return (
        <div className="w-full h-full relative flex flex-col gap-4 items-center justify-center">
            <LoadingOverlay
                visible={instanceDeletionInProgress}
                loaderProps={{
                    children: (
                        <div className="flex flex-col items-center justify-center gap-4">
                            <Loader />
                            <h1 className="text-2xl font-semibold">
                                An instance is currently being deleted.
                            </h1>
                        </div>
                    ),
                }}
            />
            <h1 className="text-2xl font-semibold">Select an instance</h1>
            {instancesLoaded ? (
                <>
                    {instances.length === 0 ? (
                        <div className="text-red-500">No instances found!</div>
                    ) : (
                        <CustomCard
                            variant="darker"
                            className="w-full sm:w-full md:w-4/5 lg:w-3/4 xl:w-1/2 !h-3/4 !px-3"
                        >
                            <ScrollArea className="w-full h-full flex">
                                <div className="flex flex-col gap-3 w-full h-full rounded-md p-2">
                                    {instances.map((instance) => (
                                        <InstanceCard
                                            key={instance.id}
                                            name={instance.name}
                                            id={instance.id}
                                        />
                                    ))}
                                </div>
                            </ScrollArea>
                        </CustomCard>
                    )}
                    <Button
                        variant="light"
                        color="blue"
                        leftSection={<IconPlus size={16} />}
                        onClick={() => {
                            console.log("Create new instance");
                            setPage("instance-create");
                        }}
                    >
                        Create new instance
                    </Button>
                </>
            ) : (
                <Loader />
            )}
        </div>
    );
}
