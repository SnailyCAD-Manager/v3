import { Card, type CardProps } from "@mantine/core";

interface Props extends CardProps {
	variant?: "default" | "darker" | "lighter";
}

export default function CustomCard(props: Props) {
	function classNames() {
		if (!props.variant)
			return "!bg-neutral-900 !outline !outline-1 !outline-neutral-800";
		if (props.variant === "default")
			return "!bg-neutral-900 !outline !outline-1 !outline-neutral-800";
		if (props.variant === "darker")
			return "!bg-neutral-950 !outline !outline-1 !outline-neutral-900";
		if (props.variant === "lighter")
			return "!bg-neutral-800 !outline !outline-1 !outline-neutral-700";
	}

	return (
		<Card {...props} className={`${classNames()} ${props.className}`}>
			{props.children}
		</Card>
	);
}
