/* eslint-disable @typescript-eslint/no-explicit-any */
import {create} from "zustand";

interface AuthState {
  user: any | null;
  loading: boolean;
  setUser: (user: any) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  logout: () => set({ user: null, loading: false }), // Clear the user on logout
}));
