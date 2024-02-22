import { Loader, Modal } from "@mantine/core";
import { notifications } from "@mantine/notifications";

interface Props {
	opened: boolean;
}

export default function UpdatingModal(props: Props) {
	function onClose() {
		notifications.show({
			title: "Update Complete",
			message: "SnailyCAD has been updated successfully!",
			color: "teal",
		});
	}

	return (
		<Modal
			opened={props.opened}
			onClose={onClose}
			withCloseButton={false}
			closeOnClickOutside={false}
			closeOnEscape={false}
			centered
			overlayProps={{
				blur: 5,
			}}
			title={
				<span className="text-lg font-bold flex items-center gap-2">
					<Loader size={16} />
					<span>Update in progress</span>
				</span>
			}
		>
			<p>
				SnailyCAD is updating. This may take a few minutes.{" "}
				<span className="text-orange-500">
					Please do not close SnailyCAD Manager.
				</span>
			</p>
		</Modal>
	);
}
