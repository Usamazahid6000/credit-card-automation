import { useState, useEffect } from "react";
import apiClient from "@/lib/api";
import { toast } from "sonner";

interface CountryData {
  country_name: string;
  contact_count: string;
  percentage_count: string;
}

interface DashboardApiResponse {
  top_10_countries: CountryData[];
  [key: string]: any;
}

interface CountryOption {
  value: string;
  label: string;
}

interface UseCountriesReturn {
  countryOptions: CountryOption[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch and manage countries from dashboard API
 * @returns {UseCountriesReturn} Object containing country options, loading state, error, and refetch function
 */
export function useCountries(): UseCountriesReturn {
  const [countryOptions, setCountryOptions] = useState<CountryOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCountries = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post<DashboardApiResponse>(
        "/Api/V8/custom/dashboard/get-dashboard-data",
        {}
      );

      if (response.data?.top_10_countries) {
        const seenCountries = new Map<string, CountryOption>();

        response.data.top_10_countries.forEach((country) => {
          const trimmedName = country.country_name.trim();
          if (trimmedName && !seenCountries.has(trimmedName)) {
            seenCountries.set(trimmedName, {
              value: trimmedName,
              label: trimmedName,
            });
          }
        });

        const options = Array.from(seenCountries.values());
        setCountryOptions(options);
      } else {
        setError("No countries found");
        setCountryOptions([]);
      }
    } catch (err: any) {
      console.error("Error fetching countries:", err);
      const errorMessage =
        err.response?.data?.message || err.message || "An error occurred";
      setError(errorMessage);
      toast.error("Failed to load countries", {
        description: errorMessage,
      });
      setCountryOptions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  return {
    countryOptions,
    loading,
    error,
    refetch: fetchCountries,
  };
}
