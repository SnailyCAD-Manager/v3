import { create } from "zustand";

type UpdateState = {
	inProgress: {
		id: string;
		inProgress: boolean;
	};
	setInProgress: (id: string, inProgress: boolean) => void;
};

export const useUpdate = create<UpdateState>((set) => ({
	inProgress: {
		id: "",
		inProgress: false,
	},
	setInProgress: (id, inProgress) =>
		set(() => ({
			inProgress: {
				id,
				inProgress,
			},
		})),
}));
