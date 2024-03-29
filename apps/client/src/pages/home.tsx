import CustomCard from "@/components/ui/CustomCard";
import { useInstance } from "@/hooks/useInstance";
import useKeys from "@/hooks/useKeys";
import { usePage } from "@/hooks/usePage";
import Delete from "@/utils/controls/delete";
import Start from "@/utils/controls/start";
import Stop from "@/utils/controls/stop";
import Update from "@/utils/controls/update";
import socket from "@/utils/socket";
import invalidTerminalCommands from "@/utils/terminal/invalid";
import {
	ActionIcon,
	Button,
	Card,
	Menu,
	TextInput,
	Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import type { CommandData } from "@scm/types";
import {
	IconChevronRight,
	IconDotsVertical,
	IconDownload,
	IconExternalLink,
	IconPlayerPlay,
	IconReload,
	IconSquare,
	IconTrash,
} from "@tabler/icons-react";
import { compareVersions } from "compare-versions";
import { useEffect, useRef } from "react";

export default function HomePage() {
	const clearLogs = useInstance((state) => state.clearLogs);
	const activeInstance = useInstance((state) => state.activeInstance);
	const setPage = usePage((state) => state.setPage);
	const instances = useInstance((state) => state.instances);
	const addLog = useInstance((state) => state.addLog);
	const shiftKey = useKeys((state) => state.shiftKey);

	const activeInstanceData = instances.find(
		(instance) => instance.id === activeInstance,
	);

	function downloadLogs() {
		const logs = activeInstanceData?.logs.join("\n");
		const element = document.createElement("a");
		const logOutput: string[] = [];

		logs?.split("\n").forEach((log) => {
			logOutput.push(
				log.replace(/<[^>]*>?/gm, "").replace(/&nbsp;/g, " "),
			);
		});

		element.setAttribute(
			"href",
			"data:text/plain;charset=utf-8," +
				encodeURIComponent(logOutput.join("\n") || "Empty Logs"),
		);
		element.setAttribute("download", `${activeInstanceData?.id}-logs.log`);
		element.style.display = "none";
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	}

	const terminalRef = useRef<HTMLPreElement>(null);

	useEffect(() => {
		terminalRef.current?.scrollTo({
			top: terminalRef.current.scrollHeight,
			behavior: "smooth",
		});
	}, [activeInstanceData?.logs.length]);

	const commandForm = useForm({
		initialValues: {
			command: "",
		},
	});

	function handleCommandSubmit(values: typeof commandForm.values) {
		addLog(
			activeInstance,
			`<span style="color: rgba(255, 255, 255, 0.5);">> ${values.command}</span>`,
		);

		if (
			invalidTerminalCommands.some((cmd) => values.command.includes(cmd))
		) {
			addLog(
				activeInstance,
				`<span style="background-color: #ff0000; padding: 0 15px; color: white;">COMMAND NOT ALLOWED!</span>`,
			);
			return commandForm.reset();
		}

		if (values.command === "cls" || values.command === "clear") {
			clearLogs(activeInstanceData?.id as string);
			addLog(activeInstance, "Logs cleared!");

			return commandForm.reset();
		}

		values.command !== "" &&
			socket.emit("server:command", {
				id: activeInstance,
				command: values.command,
			} as CommandData);
		commandForm.reset();
	}

	useEffect(() => {
		if (!activeInstance) {
			setPage("instance-selector");
		}
	}, [activeInstance]);

	function updateAvailable(current: string, latest: string) {
		return compareVersions(latest, current) === 1;
	}

	return (
		<div className="flex flex-col gap-5 items-center justify-center w-full h-full">
			<CustomCard className="w-full">
				<div className="w-full h-full gap-2 flex flex-col items-center justify-center">
					<h1 className="text-lg font-semibold text-center">
						SnailyCAD Controls
					</h1>
					<div className="flex flex-row gap-2 items-center justify-center w-full">
						{activeInstanceData?.status.client &&
						activeInstanceData?.status.api ? (
							<Button
								leftSection={<IconSquare size={16} />}
								variant="light"
								color="orange"
								onClick={() => Stop()}
							>
								Stop
							</Button>
						) : (
							<Button
								leftSection={<IconPlayerPlay size={16} />}
								variant="light"
								color="green"
								onClick={() => Start()}
							>
								Start {shiftKey ? "(Skip Build)" : ""}
							</Button>
						)}
						{activeInstanceData?.status.client &&
							activeInstanceData?.status.api && (
								<Button
									color="teal"
									variant="light"
									leftSection={<IconExternalLink size={16} />}
									component="a"
									href={
										activeInstanceData?.env
											.NEXT_PUBLIC_CLIENT_URL
									}
									target="_blank"
								>
									Open in new tab
								</Button>
							)}
						{activeInstanceData?.versions.latest !== "ERROR" &&
							updateAvailable(
								activeInstanceData?.versions.current as string,
								activeInstanceData?.versions.latest as string,
							) && (
								<Button
									leftSection={<IconDownload size={16} />}
									variant="light"
									color="blue"
									onClick={async () =>
										await Update(activeInstance)
									}
								>
									Update to v
									{activeInstanceData?.versions.latest}
								</Button>
							)}
						<Menu>
							<Menu.Target>
								<ActionIcon
									variant="subtle"
									color="gray"
									className="!rounded-full"
								>
									<IconDotsVertical size={16} />
								</ActionIcon>
							</Menu.Target>

							<Menu.Dropdown>
								<Menu.Label>Instance Management</Menu.Label>
								<Menu.Item
									leftSection={<IconReload size={16} />}
									disabled={
										!activeInstanceData?.status.client &&
										!activeInstanceData?.status.api
									}
								>
									Restart Instance
								</Menu.Item>
								<Tooltip label="This will kill any process running on the ports configured in the .env">
									<Menu.Item
										leftSection={<IconSquare size={16} />}
										color="orange"
										onClick={() => Stop()}
									>
										Force Stop
									</Menu.Item>
								</Tooltip>
								<Menu.Divider />
								<Menu.Label>Danger Area</Menu.Label>
								<Menu.Item
									leftSection={<IconTrash size={16} />}
									color="red"
									onClick={() => Delete()}
								>
									Delete Instance
								</Menu.Item>
							</Menu.Dropdown>
						</Menu>
					</div>
				</div>
			</CustomCard>
			<CustomCard className="h-full w-full flex flex-col gap-2">
				<h1 className="text-xl font-semibold text-center">
					SnailyCAD Console
				</h1>
				<Card.Section p={12} className="h-full">
					<div className="w-full h-full relative rounded-md bg-black/50">
						<pre
							ref={terminalRef}
							className="absolute flex flex-col top-0 left-0 h-[calc(100%-2.5rem)] w-full p-2 overflow-hidden hover:overflow-y-auto whitespace-pre-wrap text-sm"
						>
							{activeInstanceData?.logs.map((log, index) => (
								<span
									key={index}
									dangerouslySetInnerHTML={{
										__html: log,
									}}
								/>
							))}
						</pre>
						<form
							onSubmit={commandForm.onSubmit((values) =>
								handleCommandSubmit(values),
							)}
						>
							<TextInput
								autoComplete="off"
								variant="transparent"
								className="w-full absolute bottom-0 left-0 h-[2.5rem]"
								placeholder="Enter command..."
								leftSection={<IconChevronRight size={16} />}
								{...commandForm.getInputProps("command")}
							/>
						</form>
						<Tooltip label="Download logs" onClick={downloadLogs}>
							<ActionIcon
								className="absolute top-2 left-[calc(100%-2.2rem)]"
								size={28}
								variant="default"
							>
								<IconDownload size={16} />
							</ActionIcon>
						</Tooltip>
					</div>
				</Card.Section>
			</CustomCard>
			<div className="w-full text-center text-xs text-muted">
				{`${activeInstanceData?.name} running SnailyCAD v${activeInstanceData?.versions.current}`}{" "}
				{activeInstanceData?.versions.latest === "ERROR" ? (
					<span className="text-red-500">
						Error fetching latest version
					</span>
				) : updateAvailable(
						activeInstanceData?.versions.current as string,
						activeInstanceData?.versions.latest as string,
				  ) ? (
					<span className="text-orange-500">
						{"Update available: v"}
						{activeInstanceData?.versions.latest}
					</span>
				) : (
					<span className="text-green-500">{"Up to date"}</span>
				)}
			</div>
		</div>
	);
}
