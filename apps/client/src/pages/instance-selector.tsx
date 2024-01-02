import InstanceCard from "@/components/ui/InstanceCard";
import { useInstance } from "@/hooks/useInstance";
import { usePage } from "@/hooks/usePage";
import { Button } from "@mantine/core";
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
                // Grid of instance cards
                <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 w-full sm:w-full md:w-3/4 lg:w-1/2 gap-4">
                    {instances.map((instance) => (
                        <InstanceCard
                            name={instance.name}
                            id={instance.id}
                            key={instance.id}
                        />
                    ))}
                </div>
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
