import axios from "axios";
import configs from "@/config/api";

type RefreshTokenResponse = {
  message: string;
  access_token: string;
  refresh_token: string;
  expires_in: number;
};

export const refreshTokenAPI = async (
  refreshToken: string
): Promise<RefreshTokenResponse> => {
  const response = await axios.post(
    `${configs.apiUrl}/Api/V8/custom/portal/refresh-token`,
    { refresh_token: refreshToken },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};
