import { create } from "zustand";
import { StorageInstance } from "../types/instance";

type InstanceSettingsStore = {
    instanceSettings: StorageInstance;
    setInstanceSettings: (instance: StorageInstance) => void;
};

export const useInstanceSettings = create<InstanceSettingsStore>((set) => ({
    instanceSettings: {
        name: "",
        id: "",
        settings: {
            onStartup: {
                enabled: false,
                webhook: "",
                message: "",
            },
            crashDetection: {
                enabled: false,
                webhook: "",
                message: "",
            },
            autoRestart: {
                enabled: false,
                maxRestarts: 0,
            },
            autoUpdate: {
                enabled: false,
            },
        },
    },
    setInstanceSettings: (instance) => set({ instanceSettings: instance }),
}));
