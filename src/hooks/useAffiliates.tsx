import { useState, useEffect } from "react";
import apiClient from "@/lib/api";
import { toast } from "sonner";

interface AffiliateCompany {
  id: string;
  name: string;
  [key: string]: any;
}

interface AffiliateApiResponse {
  affiliate_companies: AffiliateCompany[];
  [key: string]: any;
}

interface AffiliateOption {
  value: string;
  label: string;
}

interface UseAffiliatesReturn {
  affiliateOptions: AffiliateOption[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch and manage affiliate companies
 * @returns {UseAffiliatesReturn} Object containing affiliate options, loading state, error, and refetch function
 */
export function useAffiliates(): UseAffiliatesReturn {
  const [affiliateOptions, setAffiliateOptions] = useState<AffiliateOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAffiliates = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post<AffiliateApiResponse>(
        "/Api/V8/custom/portal/fetch-affiliates",
        {}
      );

      if (response.data?.affiliate_companies) {
        // Transform affiliate companies into dropdown options
        const options = response.data.affiliate_companies.map((affiliate) => ({
          value: affiliate.id,
          label: affiliate.name,
        }));
        setAffiliateOptions(options);
      } else {
        setError("No affiliate companies found");
      }
    } catch (err: any) {
      console.error("Error fetching affiliates:", err);
      const errorMessage =
        err.response?.data?.message || err.message || "An error occurred";
      setError(errorMessage);
      toast.error("Failed to load affiliates", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAffiliates();
  }, []);

  return {
    affiliateOptions,
    loading,
    error,
    refetch: fetchAffiliates,
  };
}

