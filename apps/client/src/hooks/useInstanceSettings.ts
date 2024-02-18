import { create } from "zustand";
import type { StorageInstance } from "@scm/types";

type InstanceSettingsStore = {
    instanceSettings: StorageInstance;
    setInstanceSettings: (instance: StorageInstance) => void;
};

export const useInstanceSettings = create<InstanceSettingsStore>((set) => ({
    instanceSettings: {
        name: "",
        id: "",
        path: "",
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
