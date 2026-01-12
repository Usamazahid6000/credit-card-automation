import { useState, useEffect } from "react";
import {
  Search,
  Loader2,
  FileText,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Globe,
  Users,
  Activity,
  ListPlus,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchableDropdown } from "@/components/ui/SearchableDropdown";
import { CreateTargetListModal } from "@/components/CreateTargetListModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import apiClient from "@/lib/api";
import { toast } from "sonner";
import { useAffiliates } from "@/hooks/useAffiliates";
import { useCountries } from "@/hooks/useCountries";

interface CustomerData {
  attributes: {
    contact_id: string;
    first_name: string;
    last_name: string;
    date_entered: string;
    status_c: string;
    affiliate_company_id: string | null;
    document_id: string;
    filename: string;
    document_revision_id: string;
    credit_card_id: string;
    ccn_expected: string;
    passport_country: string;
    customer_name: string;
    ccn_actual: string;
    luhn_test_expected: string;
    luhn_test_actual: string;
    [key: string]: any;
  };
}

interface ApiResponse {
  data: CustomerData[];
  meta: {
    "total-pages": number;
    "records-on-this-page": number;
  };
}

interface FilterState {
  date_range: string;
  country: string;
  affiliate_company_id: string;
  status_c: string;
}

// Date range options matching API format
const dateOptions = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "last_7_days", label: "Last 7 Days" },
  { value: "last_30_days", label: "Last 30 Days" },
  { value: "this_month", label: "This Month" },
  { value: "last_month", label: "Last Month" },
  { value: "custom", label: "Custom Range" },
];

const statusOptions = [
  {
    label: "Refund Request Created",
    value: "refund_request_created",
  },
  { label: "Check 0", value: "check_0" },
  {
    label: "Check 0 - Reject",
    value: "check_0_reject",
  },
  { label: "Claim", value: "claim" },
  {
    label: "Facturacion",
    value: "facturacion",
  },
  {
    label: "CS Missing Docs",
    value: "cs_missing_docs",
  },
  { label: "Lost", value: "lost" },
  {
    label: "Quality Control",
    value: "quality_control",
  },
  {
    label: "Check 2 - Pending",
    value: "check_2_pending",
  },
  {
    label: "Check 2 - Reject",
    value: "check_2_reject",
  },
  {
    label: "Contabilidad - Pending",
    value: "contabilidad_pending",
  },
  {
    label: "Approved for Payment",
    value: "approved_for_payment",
  },
  {
    label: "Submitted 4 Payment to PP",
    value: "sent_to_payment",
  },
  { label: "Paid", value: "paid" },
  {
    label: "Approved by SAT",
    value: "approved_by_sat",
  },
  {
    label: "Check 0 - Error",
    value: "check_0_error",
  },
  {
    label: "Quarantine",
    value: "quarantine",
  },
  {
    label: "Quality Control",
    value: "quality_control",
  },
  {
    label: "Submitted to SAT",
    value: "submitted_to_sat",
  },
];

export function ListView() {
  const [filters, setFilters] = useState<FilterState>({
    date_range: "",
    country: "",
    affiliate_company_id: "",
    status_c: "",
  });
  const [data, setData] = useState<CustomerData[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [recordsOnPage, setRecordsOnPage] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);
  const [isCreateListModalOpen, setIsCreateListModalOpen] = useState(false);

  // Use custom hook to fetch affiliates
  const { affiliateOptions } = useAffiliates();

  // Use custom hook to fetch countries
  const { countryOptions } = useCountries();

  const fetchData = async (page: number = 1) => {
    setLoading(true);
    try {
      const response = await apiClient.post<ApiResponse>(
        "/Api/V8/custom/customer/get-credit-card-validation-data",
        {
          filter_parts: {
            date_range: filters.date_range || "",
            country: filters.country || "",
            affiliate_company_id: filters.affiliate_company_id || "",
            status_c: filters.status_c || "",
          },
          page_no: page,
          order_by: "contacts.date_entered DESC",
        }
      );

      if (response.data?.data) {
        setData(response.data.data);
        setTotalPages(response.data.meta?.["total-pages"] || 1);
        setRecordsOnPage(response.data.meta?.["records-on-this-page"] || 0);
        setHasSearched(true);
        toast.success("Data loaded successfully", {
          description: `Found ${response.data.data.length} records`,
        });
      }
    } catch (error: any) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data", {
        description:
          error.response?.data?.message || error.message || "An error occurred",
      });
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchData(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchData(page);
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Collect all contact_ids from the current filtered results
  const getContactIds = () => {
    return data.map((item) => item.attributes.contact_id);
  };

  // Check if any filter is applied
  const hasActiveFilters = Object.values(filters).some(
    (value) => value.trim() !== ""
  );

  const isSearchEnabled = !loading;

  return (
    <div className="space-y-8">
      {/* Filter Section */}
      <section className="space-y-4">
        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          2. Search List view Results
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
                value={filters.date_range}
                onChange={(value) => handleFilterChange("date_range", value)}
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
                value={filters.country}
                onChange={(value) => handleFilterChange("country", value)}
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
                value={filters.affiliate_company_id}
                onChange={(value) =>
                  handleFilterChange("affiliate_company_id", value)
                }
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
                value={filters.status_c}
                onChange={(value) => handleFilterChange("status_c", value)}
                icon={<Activity className="h-4 w-4" />}
              />
            </div>
          </div>

          <Button
            onClick={handleSearch}
            disabled={!isSearchEnabled}
            className="btn-gradient w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                Search Records
              </>
            )}
          </Button>
        </div>
      </section>

      {/* Results Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            3. RESULTS
          </h2>
          <div className="flex items-center gap-4">
            {hasSearched && (
              <p className="text-xs text-muted-foreground">
                Page {currentPage} of {totalPages} • {recordsOnPage} records on
                this page
              </p>
            )}
            {hasSearched && data.length > 0 && hasActiveFilters && (
              <Button
                onClick={() => setIsCreateListModalOpen(true)}
                variant="outline"
                className="flex items-center gap-2 border-primary text-primary hover:bg-primary/10"
              >
                <ListPlus className="h-4 w-4" />
                Create Target List
              </Button>
            )}
          </div>
        </div>

        <div className="card-dashed">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
              <span className="ml-3 text-muted-foreground">
                Loading data...
              </span>
            </div>
          ) : hasSearched && data.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer Name</TableHead>
                    <TableHead>Filename</TableHead>
                    <TableHead>CCN Expected</TableHead>
                    <TableHead>CCN Actual</TableHead>
                    <TableHead>Luhn Test Expected</TableHead>
                    <TableHead>Luhn Test Actual</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((item) => (
                    <TableRow key={item.attributes.contact_id}>
                      <TableCell className="font-medium">
                        {item.attributes.customer_name ||
                          `${item.attributes.first_name || ""} ${
                            item.attributes.last_name || ""
                          }`.trim() ||
                          "-"}
                      </TableCell>

                      <TableCell>
                        <span className="text-xs text-muted-foreground">
                          {item.attributes.filename || "-"}
                        </span>
                      </TableCell>
                      <TableCell>
                        {item.attributes.ccn_expected || "-"}
                      </TableCell>
                      <TableCell>{item.attributes.ccn_actual || "-"}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                            item.attributes.luhn_test_expected === "Pass"
                              ? "bg-green-500/10 text-green-500 border border-green-500/20"
                              : "bg-red-500/10 text-red-500 border border-red-500/20"
                          }`}
                        >
                          {item.attributes.luhn_test_expected || "-"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                            item.attributes.luhn_test_actual === "Pass"
                              ? "bg-green-500/10 text-green-500 border border-green-500/20"
                              : item.attributes.luhn_test_actual === "Fail"
                              ? "bg-red-500/10 text-red-500 border border-red-500/20"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {item.attributes.luhn_test_actual || "-"}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : hasSearched && data.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">
                No records found matching your filters.
              </p>
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">
                No data loaded. Enter filters and search to begin.
              </p>
            </div>
          )}

          {/* Pagination */}
          {hasSearched && data.length > 0 && totalPages > 1 && (
            <div className="mt-6 pt-6 border-t border-border">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) {
                          handlePageChange(currentPage - 1);
                        }
                      }}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 10) {
                      pageNum = i + 1;
                    } else if (currentPage <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 4) {
                      pageNum = totalPages - 9 + i;
                    } else {
                      pageNum = currentPage - 5 + i;
                    }

                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(pageNum);
                          }}
                          isActive={currentPage === pageNum}
                          className="cursor-pointer"
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) {
                          handlePageChange(currentPage + 1);
                        }
                      }}
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </section>

      {/* Create Target List Modal */}
      <CreateTargetListModal
        open={isCreateListModalOpen}
        onOpenChange={setIsCreateListModalOpen}
        contactIds={getContactIds()}
        contactCount={data.length}
      />
    </div>
  );
}
