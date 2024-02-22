import { modals } from "@mantine/modals";
import socket from "../socket";

export default function UpdateManager() {
	modals.openConfirmModal({
		title: (
			<span className="text-lg font-bold">Update SnailyCAD Manager?</span>
		),
		centered: true,
		children: (
			<div className="text-sm">
				<p className="mt-2">
					Are you sure you want to update SnailyCAD Manager?
				</p>
				<p className="mt-2 text-orange-500">
					This will kill all instances, and the manager will be
					offline until the update completes.
				</p>
			</div>
		),
		confirmProps: {
			children: "Update",
			color: "blue",
			variant: "light",
		},
		cancelProps: {
			children: "Cancel",
			color: "gray",
			variant: "light",
		},
		onConfirm: () => {
			socket.emit("server:update-manager");
		},
	});
}
