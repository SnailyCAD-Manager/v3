import { usePage } from "@/hooks/usePage";
import { Button } from "@mantine/core";

export default function NotFound() {
	const { setPage } = usePage();

	return (
		<div className="w-full h-full flex flex-col gap-2 items-center justify-center">
			<h1 className="text-3xl text-center">404 - Page not found</h1>
			<p className="text-center">
				The page you are looking for does not exist. Pretty odd
				considering that this is a single page application.
			</p>
			<Button onClick={() => setPage("home")}>Go to home page</Button>
		</div>
	);
}
