import { Select } from "@mantine/core";
import { modals } from "@mantine/modals";
import axios from "axios";

let cachedReleases: { tag_name: string }[] = [];

export default async function Downgrade() {
	const { data } = await axios.get(
		"https://api.github.com/repos/SnailyCAD/snaily-cadv4/releases",
	);
	cachedReleases = data.slice(0, 10);

	const releases = cachedReleases.map((release) => {
		return {
			value: release.tag_name,
			label: release.tag_name,
		};
	});

	modals.openConfirmModal({
		title: <span className="text-lg font-bold">Downgrade SnailyCAD</span>,
		children: (
			<Select
				label="Select Version"
				data={releases}
				placeholder="Select version to downgrade to"
			/>
		),
		centered: true,
		confirmProps: {
			variant: "light",
			children: "Downgrade",
		},
		cancelProps: {
			variant: "light",
			children: "Cancel",
			color: "red",
		},
	});
}
