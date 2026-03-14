import { create } from 'zustand';

interface AuthState {
  orgId: string | null;
  userId: string | null;
  userEmail: string | null;
  userRole: string | null;
  setAuth: (orgId: string, userId: string, email: string, role: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  orgId: null,
  userId: null,
  userEmail: null,
  userRole: null,
  setAuth: (orgId, userId, userEmail, userRole) => set({ orgId, userId, userEmail, userRole }),
  clearAuth: () => set({ orgId: null, userId: null, userEmail: null, userRole: null }),
}));
