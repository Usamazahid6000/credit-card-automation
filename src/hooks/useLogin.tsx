import { useState } from "react";
import apiClient from "@/lib/api";
import { useAuthStore } from "@/store/auth";

type LoginPayload = {
  email: string;
  password: string;
};

export const login = async (data: LoginPayload) => {
  const response = await apiClient.post(
    "/Api/V8/custom/portal/automation-login",
    data
  );
  return response.data;
};

type LoginResponse = {
  login: boolean;
  code_verification_required?: boolean;
  code_id?: string;
  message: string;
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  user?: Record<string, any>;
};

export const useLogin = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);
  const setCodeId = useAuthStore((state) => state.setCodeId);

  const handleLogin = async (data: LoginPayload): Promise<LoginResponse> => {
    setIsSubmitting(true);
    try {
      const result = await login(data);

      // If code verification is required, store code_id and return early
      if (
        result.login &&
        result.code_verification_required &&
        result.code_id &&
        result.code_id !== ""
      ) {
        setCodeId(result.code_id);
        return result;
      }

      // Otherwise, set auth normally (for cases without 2FA)
      if (result.access_token) {
        setAuth({
          user: result.user,
          access_token: result.access_token,
          refresh_token: result.refresh_token,
          expires_in: result.expires_in,
        });
      }

      return result;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleLogin, isSubmitting, setIsSubmitting };
};
