import { Instance } from "@/types/instance";
import { create } from "zustand";

type InstanceState = {
    instances: Instance[];
    activeInstance: string;
    activeInstanceData: Instance | null;
    setActiveInstance: (id: string) => void;
    addInstance: (instance: Instance) => void;
    removeInstance: (id: string) => void;
    updateInstance: (instance: Instance) => void;
    addLog: (id: string, log: string) => void;
};

export const useInstance = create<InstanceState>((set) => ({
    instances: [],
    activeInstance: "",
    activeInstanceData: null,
    setActiveInstance: (id) =>
        set((state) => ({
            activeInstance: id,
            activeInstanceData:
                state.instances.find((i) => i.id === id) || null,
        })),
    addInstance: (instance) =>
        set((state) => ({ instances: [...state.instances, instance] })),
    removeInstance: (id) =>
        set((state) => ({
            instances: state.instances.filter((instance) => instance.id !== id),
        })),
    updateInstance: (instance) =>
        set((state) => ({
            instances: state.instances.map((i) =>
                i.id === instance.id ? instance : i
            ),
        })),
    addLog: (id, log) => {
        const instance = useInstance
            .getState()
            .instances.find((i) => i.id === id);

        if (!instance) return;

        if (instance.logs.length > 1000) {
            instance.logs.shift();
        }

        instance.logs.push(log);

        useInstance.getState().updateInstance(instance);
    },
}));

function getActiveInstance() {
    return useInstance.getState().activeInstance;
}

function getActiveInstanceData() {
    return useInstance.getState().activeInstanceData;
}

export { getActiveInstance, getActiveInstanceData };
