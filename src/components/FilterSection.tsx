import { Calendar, Globe, Users, Activity, Search } from "lucide-react";
import { SearchableDropdown } from "@/components/ui/SearchableDropdown";
import { useState } from "react";

const dateOptions = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "last-7-days", label: "Last 7 Days" },
  { value: "last-30-days", label: "Last 30 Days" },
  { value: "this-month", label: "This Month" },
  { value: "last-month", label: "Last Month" },
  { value: "custom", label: "Custom Range" },
];

const countryOptions = [
  { value: "us", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "ca", label: "Canada" },
  { value: "au", label: "Australia" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
  { value: "jp", label: "Japan" },
  { value: "in", label: "India" },
  { value: "br", label: "Brazil" },
  { value: "mx", label: "Mexico" },
];

const affiliateOptions = [
  { value: "aff-001", label: "Affiliate Partner 001" },
  { value: "aff-002", label: "Affiliate Partner 002" },
  { value: "aff-003", label: "Affiliate Partner 003" },
  { value: "aff-004", label: "Digital Marketing Inc" },
  { value: "aff-005", label: "Growth Partners LLC" },
  { value: "aff-006", label: "Media Buyers Pro" },
  { value: "aff-007", label: "Traffic Kings" },
];

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "completed", label: "Completed" },
  { value: "failed", label: "Failed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "refunded", label: "Refunded" },
];

interface FilterSectionProps {
  onSearch: (filters: {
    date: string;
    country: string;
    affiliate: string;
    status: string;
  }) => void;
}

export function FilterSection({ onSearch }: FilterSectionProps) {
  const [date, setDate] = useState("");
  const [country, setCountry] = useState("");
  const [affiliate, setAffiliate] = useState("");
  const [status, setStatus] = useState("");

  const handleSearch = () => {
    onSearch({ date, country, affiliate, status });
  };

  return (
    <section className="space-y-4">
      <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        1. FILTER OPTIONS
      </h2>
      
      <div className="card-dashed">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase">
              Date
            </label>
            <SearchableDropdown
              placeholder="Select Date Range"
              options={dateOptions}
              value={date}
              onChange={setDate}
              icon={<Calendar className="h-4 w-4" />}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase">
              Country
            </label>
            <SearchableDropdown
              placeholder="Select Country"
              options={countryOptions}
              value={country}
              onChange={setCountry}
              icon={<Globe className="h-4 w-4" />}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase">
              Affiliate
            </label>
            <SearchableDropdown
              placeholder="Select Affiliate"
              options={affiliateOptions}
              value={affiliate}
              onChange={setAffiliate}
              icon={<Users className="h-4 w-4" />}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase">
              Status
            </label>
            <SearchableDropdown
              placeholder="Select Status"
              options={statusOptions}
              value={status}
              onChange={setStatus}
              icon={<Activity className="h-4 w-4" />}
            />
          </div>
        </div>

        <button 
          onClick={handleSearch}
          className="btn-gradient w-full flex items-center justify-center gap-2"
        >
          <Search className="h-4 w-4" />
          Search Records
        </button>
      </div>
    </section>
  );
}
