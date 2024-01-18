import { create } from "zustand";

type KeysState = {
    shiftKey: boolean;
    setShiftKey: (shiftKey: boolean) => void;
};

const useKeys = create<KeysState>((set) => ({
    shiftKey: false,
    setShiftKey: (shiftKey) => set({ shiftKey }),
}));

export default useKeys;
