import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { NavigationProgress } from "@mantine/nprogress";
import PageProvider from "./PageProvider";
import ShortcutProvider from "./ShortcutProvider";
import SocketProvider from "./SocketProvider";

interface Props {
	children: React.ReactNode;
}

export default function Providers(props: Props) {
	return (
		<MantineProvider forceColorScheme="dark" defaultColorScheme="dark">
			<ShortcutProvider />
			<PageProvider />
			<Notifications />
			<SocketProvider />
			<NavigationProgress />
			<ModalsProvider>{props.children}</ModalsProvider>
		</MantineProvider>
	);
}
