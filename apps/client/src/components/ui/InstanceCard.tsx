import { Button } from "@mantine/core";
import CustomCard from "./CustomCard";
import { useInstance } from "@/hooks/useInstance";
import { usePage } from "@/hooks/usePage";

interface Props {
    name: string;
    id: string;
}

export default function InstanceCard(props: Props) {
    const { setActiveInstance, activeInstance } = useInstance();
    const { setPage } = usePage();

    function selectInstance() {
        setActiveInstance(props.id);
        setPage("home");
    }

    return (
        <CustomCard
            className={`flex flex-col items-center gap-2 w-full h-fit ${
                activeInstance === props.id && "!outline-2 !outline-blue-500"
            }`}
        >
            <h1 className="text-md font-semibold flex flex-row gap-1 items-center">
                {props.name}{" "}
            </h1>
            <Button variant="default" color="blue" onClick={selectInstance}>
                Select
            </Button>
        </CustomCard>
    );
}
