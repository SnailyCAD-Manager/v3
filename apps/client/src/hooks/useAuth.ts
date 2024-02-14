import { User } from "@scm/types";
import { create } from "zustand";

type AuthState = {
    isAuth: boolean;
    setIsAuth: (isAuth: boolean) => void;
    user: User | null;
    setUser: (user: User | null) => void;
};

export const useAuth = create<AuthState>((set) => ({
    isAuth: false,
    setIsAuth: (isAuth) => set({ isAuth }),
    user: null,
    setUser: (user) => set({ user }),
}));
