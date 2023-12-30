import { create } from "zustand";

type AuthState = {
    isAuth: boolean;
    setIsAuth: (isAuth: boolean) => void;
};

export const useAuth = create<AuthState>((set) => ({
    isAuth: true,
    setIsAuth: (isAuth) => set({ isAuth }),
}));
