import CustomCard from "@/components/ui/CustomCard";
import InstanceCard from "@/components/ui/InstanceCard";
import { useInstance } from "@/hooks/useInstance";
import { usePage } from "@/hooks/usePage";
import { Button, ScrollArea } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";

export default function InstanceSelector() {
    const { instances } = useInstance();
    const { setPage } = usePage();
    return (
        <div className="w-full h-full flex flex-col gap-4 items-center justify-center">
            <h1 className="text-2xl font-semibold">Select an instance</h1>
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
                onClick={() => setPage("instance-create")}
            >
                Create new instance
            </Button>
        </div>
    );
}
