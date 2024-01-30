import { Instance } from "@scm/types";
import { create } from "zustand";

type InstanceState = {
    instances: Instance[];
    activeInstance: string;
    activeInstanceData: Instance | null;
    instancesLoaded: boolean;
    instanceDeletionInProgress: boolean;
    setActiveInstance: (id: string) => void;
    addInstance: (instance: Instance) => void;
    removeInstance: (id: string) => void;
    updateInstance: (instance: Instance) => void;
    addLog: (id: string, log: string) => void;
    clearLogs: (id: string) => void;
    setInstancesLoaded: (loaded: boolean) => void;
    setInstanceDeletionInProgress: (inProgress: boolean) => void;
};

export const useInstance = create<InstanceState>((set) => ({
    instances: [],
    activeInstance: "",
    activeInstanceData: null,
    instancesLoaded: false,
    instanceDeletionInProgress: false,
    setActiveInstance: (id: string) => {
        set((state) => ({
            ...state,
            activeInstance: id,
            activeInstanceData: state.instances.find(
                (instance) => instance.id === id
            )!,
        }));
    },
    addInstance: (instance: Instance) =>
        set((state) => ({
            ...state,
            instances: [...state.instances, instance],
        })),
    removeInstance: (id: string) =>
        set((state) => ({
            ...state,
            instances: state.instances.filter((instance) => instance.id !== id),
        })),
    updateInstance: (instance: Instance) => {
        set((state) => ({
            ...state,
            instances: state.instances.map((inst) =>
                inst.id === instance.id ? instance : inst
            ),
        }));
    },
    addLog: (id: string, log: string) =>
        set((state) => ({
            ...state,
            instances: state.instances.map((inst) =>
                inst.id === id ? { ...inst, logs: [...inst.logs, log] } : inst
            ),
        })),
    clearLogs: (id: string) =>
        set((state) => ({
            ...state,
            instances: state.instances.map((inst) =>
                inst.id === id ? { ...inst, logs: [] } : inst
            ),
        })),
    setInstancesLoaded: (loaded: boolean) =>
        set((state) => ({ ...state, instancesLoaded: loaded })),
    setInstanceDeletionInProgress: (inProgress: boolean) =>
        set((state) => ({ ...state, instanceDeletionInProgress: inProgress })),
}));

function getActiveInstance() {
    return useInstance.getState().activeInstance;
}

function getActiveInstanceData() {
    return useInstance.getState().activeInstanceData;
}

export { getActiveInstance, getActiveInstanceData };
