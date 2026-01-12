import { create } from "zustand";
import { devtools } from "zustand/middleware";

type User = Record<string, any> | null;

type RefreshTokenResponse = {
  message: string;
  access_token: string;
  refresh_token: string;
  expires_in: number;
};

type AuthState = {
  user: User;
  accessToken: string | null;
  refreshToken: string | null;
  expiresIn: number | null;
  codeId: string | null;
  setAuth: (payload: {
    user?: User;
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
  }) => void;
  setCodeId: (codeId: string) => void;
  clearAuth: () => void;
  refreshAccessToken: () => Promise<RefreshTokenResponse | null>;
};

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      expiresIn: null,
      codeId: null,

      setAuth: ({ user, access_token, refresh_token, expires_in }) => {
        set({
          user: user ?? null,
          accessToken: access_token ?? null,
          refreshToken: refresh_token ?? null,
          expiresIn: expires_in ?? null,
          codeId: null,
        });

        if (access_token) {
          localStorage.setItem("access_token", access_token);
        }
        if (refresh_token) {
          localStorage.setItem("refresh_token", refresh_token);
        }

        if (expires_in !== undefined) {
          localStorage.setItem("expires_in", String(expires_in));
        }
      },

      setCodeId: (codeId: string) => {
        set({ codeId });
      },

      clearAuth: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          expiresIn: null,
          codeId: null,
        });

        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        localStorage.removeItem("expires_in");
      },

      refreshAccessToken: async (): Promise<RefreshTokenResponse | null> => {
        const refreshToken = useAuthStore.getState().refreshToken;

        if (!refreshToken) {
          return null;
        }

        try {
          // Use separate refresh token API to avoid interceptor loops
          const { refreshTokenAPI } = await import("@/lib/refreshToken");
          const data = await refreshTokenAPI(refreshToken);

          // Update auth store with new tokens
          useAuthStore.getState().setAuth({
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            expires_in: data.expires_in,
          });

          return data;
        } catch (error) {
          // If refresh fails, clear auth
          useAuthStore.getState().clearAuth();
          return null;
        }
      },
    }),
    { name: "AuthStore", trace: true }
  )
);
