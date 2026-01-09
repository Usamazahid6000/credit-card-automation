import * as React from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

interface Option {
  value: string;
  label: string;
}

interface SearchableDropdownProps {
  placeholder: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
}

export function SearchableDropdown({
  placeholder,
  options,
  value,
  onChange,
  icon,
}: SearchableDropdownProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase())
  );

  const selectedOption = options.find((option) => option.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="dropdown-trigger group">
          <div className="flex items-center gap-3">
            {icon && (
              <span className="text-primary">{icon}</span>
            )}
            <span className={cn(
              "text-sm",
              selectedOption ? "text-foreground" : "text-muted-foreground"
            )}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>
          <ChevronDown className={cn(
            "h-4 w-4 text-muted-foreground transition-transform duration-200",
            open && "rotate-180"
          )} />
        </button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[var(--radix-popover-trigger-width)] p-0 bg-popover border-border z-50"
        align="start"
      >
        <div className="p-2 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Search ${placeholder.toLowerCase()}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-card border-border focus-visible:ring-primary/30"
            />
          </div>
        </div>
        <div className="max-h-60 overflow-y-auto p-1">
          {filteredOptions.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              No results found
            </div>
          ) : (
            filteredOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                  setSearch("");
                }}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors",
                  "hover:bg-secondary text-foreground",
                  value === option.value && "bg-primary/10 text-primary"
                )}
              >
                <Check
                  className={cn(
                    "h-4 w-4",
                    value === option.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {option.label}
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
