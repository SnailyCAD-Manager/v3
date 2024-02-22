import { useInstance } from "@/hooks/useInstance";
import { ValidPageId, usePage } from "@/hooks/usePage";
import { useEffect } from "react";

declare global {
	interface Window {
		setPage: (page: string) => void;
	}
}

export default function PageProvider(): null {
	const activeInstance = useInstance((state) => state.activeInstance);
	const setPage = usePage((state) => state.setPage);
	const page = usePage((state) => state.page);

	process.env.NODE_ENV === "development" &&
		(window.setPage = (page: string) => {
			setPage(page as unknown as ValidPageId);
		});

	useEffect(() => {
		if (page.id !== "login" && !activeInstance) {
			setPage("instance-selector");
		}
	}, []);

	return null;
}
