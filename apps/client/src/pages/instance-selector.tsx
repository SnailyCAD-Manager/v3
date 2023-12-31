import InstanceCard from "@/components/ui/InstanceCard";
import { useInstance } from "@/hooks/useInstance";
import { Alert, Button, SimpleGrid } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";

export default function InstanceSelector() {
    const { instances } = useInstance();
    return (
        <div className="w-full h-full flex flex-col gap-4 items-center justify-center">
            <h1 className="text-2xl font-semibold">Select an instance</h1>
            {instances.length === 0 ? (
                <div className="text-red-500">No instances found!</div>
            ) : (
                <SimpleGrid
                    // If there's only 1 instance, show 1 col. If there's 2, show 2, if there's 3, show 3, if there's 4, show 4, if there's more than 4, show 4
                    cols={instances.length > 4 ? 4 : instances.length}
                >
                    {instances.map((instance) => (
                        <InstanceCard
                            key={instance.id}
                            name={instance.name}
                            id={instance.id}
                        />
                    ))}
                </SimpleGrid>
            )}
            <Button
                variant="light"
                color="blue"
                leftSection={<IconPlus size={16} />}
            >
                Create new instance
            </Button>
        </div>
    );
}
