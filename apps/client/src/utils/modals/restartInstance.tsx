import { modals } from "@mantine/modals";

interface Props {
	instanceName: string;
	instanceId: string;
}

export default function RestartInstanceModal(props: Props) {
	modals.openConfirmModal({
		title: <h1 className="text-lg font-semibold">Restart Instance</h1>,
		centered: true,
		children: (
			<div className="flex flex-col gap-2">
				<div>
					Are you sure you want to restart{" "}
					<span className="font-semibold">{props.instanceName}</span>?
				</div>
				<div className="text-orange-500">
					This will stop the instance {"(if running)"} and start it
					again.
				</div>
			</div>
		),
		confirmProps: {
			variant: "light",
			color: "blue",
			children: "Confirm Restart",
		},
		cancelProps: {
			variant: "light",
			color: "red",
			children: "Cancel",
		},
	});
}
