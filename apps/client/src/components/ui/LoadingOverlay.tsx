import { Loader } from "@mantine/core";
import { nprogress } from "@mantine/nprogress";
import { useEffect } from "react";

export default function LoadingOverlay() {
	useEffect(() => {
		nprogress.start();
	}, []);

	return (
		<div className="w-screen h-screen top-0 left-0 absolute z-50 flex flex-col gap-2 items-center justify-center">
			<h1 className="text-3xl text-center">
				Waiting for connection to server...
			</h1>
			<Loader size={64} />
		</div>
	);
}
