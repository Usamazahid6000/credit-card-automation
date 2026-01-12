import { useState } from "react";
import { Header } from "@/components/Header";
import { FilterSection } from "@/components/FilterSection";
import { StatusSection } from "@/components/StatusSection";
import { ResultsSection } from "@/components/ResultsSection";
import { ListView } from "@/components/ListView";
import { toast } from "sonner";

export default function Dashboard() {
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (filters: {
    date: string;
    country: string;
    affiliate: string;
    status: string;
  }) => {
    console.log("Searching with filters:", filters);
    setHasSearched(true);
    toast.success("Search initiated", {
      description: "Processing your filter request...",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container px-6 py-8 space-y-8 animate-fade-in">
        {/* <FilterSection onSearch={handleSearch} /> */}
        <ListView />
      </main>
    </div>
  );
}
