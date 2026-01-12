import configs from "@/config/api";
import axios from "axios";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";

type AuthContextType = {
  accessToken: string | null;
  refreshToken: string | null;
  expiresIn: number | null;
  userId: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  setTokens: (data: any) => void;
  clearTokens: () => void;
};

export const validateToken = async (accessToken: string) => {
  const response = await axios.post(
    `${configs.apiUrl}/Api/V8/custom/portal/validate-token`,
    { access_token: accessToken },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  refreshToken: null,
  expiresIn: null,
  userId: null,
  isAuthenticated: false,
  loading: true,
  setTokens: () => {},
  clearTokens: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [authData, setAuthData] = useState({
    accessToken: null,
    refreshToken: null,
    expiresIn: null,
    userId: null,
    isAuthenticated: false,
  });

  const clearTokens = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("expires_in");
    localStorage.removeItem("agent_id");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user");
    setAuthData({
      accessToken: null,
      refreshToken: null,
      expiresIn: null,
      userId: null,
      isAuthenticated: false,
    });
    // Also clear Zustand store to keep both systems in sync
    useAuthStore.getState().clearAuth();
  }, []);

  const setTokens = useCallback((data: any) => {
    try {
      const { access_token, refresh_token, expires_in, user } = data;
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
      localStorage.setItem("expires_in", expires_in);
      localStorage.setItem("user_id", user?.id);
      // Store user object in localStorage for later retrieval
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }
      setAuthData({
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresIn: parseInt(expires_in),
        userId: user?.id,
        isAuthenticated: true,
      });
      // Also update Zustand store to keep both systems in sync
      useAuthStore.getState().setAuth({
        user: user ?? null,
        access_token,
        refresh_token,
        expires_in,
      });
    } catch (error) {
      console.error("Error setting tokens:", error);
    }
  }, []);

  const loadAuthData = async () => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      setAuthData({
        accessToken: null,
        refreshToken: null,
        expiresIn: null,
        userId: null,
        isAuthenticated: false,
      });
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      const expiresIn = localStorage.getItem("expires_in");
      const userId = localStorage.getItem("user_id");

      const response = await validateToken(accessToken);

      if (!response?.success || response?.status === false) {
        clearTokens();

        navigate("/login");
        toast.error("Session expired, please login again");

        return;
      }

      setAuthData({
        accessToken,
        refreshToken,
        expiresIn: expiresIn ? parseInt(expiresIn) : null,
        userId,
        isAuthenticated: true,
      });

      const userData = localStorage.getItem("user");
      const user = userData ? JSON.parse(userData) : null;

      useAuthStore.getState().setAuth({
        user,
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: expiresIn ? parseInt(expiresIn) : null,
      });
    } catch (e) {
      console.error("Token validation failed:", e);
      clearTokens();
      navigate("/login");
      toast.error("Session expired, please login again");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuthData();
    // eslint-disable-next-line
  }, [clearTokens]);

  return (
    <AuthContext.Provider
      value={{ ...authData, loading, setTokens, clearTokens }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
