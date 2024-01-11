import { useInstance } from "@/hooks/useInstance";
import { usePage } from "@/hooks/usePage";
import { useEffect } from "react";

export default function PageProvider(): null {
    const activeInstance = useInstance((state) => state.activeInstance);
    const setPage = usePage((state) => state.setPage);
    const page = usePage((state) => state.page);

    useEffect(() => {
        if (page.id !== "login" && !activeInstance) {
            setPage("instance-selector");
        }
    }, []);

    return null;
}
