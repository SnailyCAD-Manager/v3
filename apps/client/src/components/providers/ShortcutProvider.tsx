import { useInstance } from "@/hooks/useInstance";
import useKeys from "@/hooks/useKeys";
import { usePage } from "@/hooks/usePage";
import { useEffect } from "react";

export default function ShortcutProvider() {
    const page = usePage((state) => state.page);
    const activeInstance = useInstance((state) => state.activeInstance);
    const clearLogs = useInstance((state) => state.clearLogs);
    const addLog = useInstance((state) => state.addLog);
    const setShiftKey = useKeys((state) => state.setShiftKey);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey) {
                if (e.key === "s") {
                    e.preventDefault();
                    e.stopPropagation();
                }

                if (e.key === "l") {
                    e.preventDefault();
                    e.stopPropagation();

                    if (page.id === "home") {
                        clearLogs(activeInstance);
                        addLog(activeInstance, "Logs cleared.");
                    }
                }
            }

            if (e.shiftKey) {
                setShiftKey(true);
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === "Shift") {
                setShiftKey(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
    }, []);

    return null;
}
