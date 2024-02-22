import { create } from "zustand";

type ManagerUpdateState = {
	updateAvailable: boolean;
	setUpdateAvailable: (updateAvailable: boolean) => void;
};

export const useManagerUpdate = create<ManagerUpdateState>((set) => ({
	updateAvailable: false,
	setUpdateAvailable: (updateAvailable) => set({ updateAvailable }),
}));
