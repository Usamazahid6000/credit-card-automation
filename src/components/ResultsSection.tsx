import { FileText } from "lucide-react";

interface ResultsSectionProps {
  hasData: boolean;
}

export function ResultsSection({ hasData }: ResultsSectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        RESULTS
      </h2>
      
      <div className="card-dashed min-h-[150px] flex items-center justify-center">
        {hasData ? (
          <div className="w-full">
            {/* Results table would go here */}
            <p className="text-muted-foreground text-center">Results will appear here</p>
          </div>
        ) : (
          <div className="text-center">
            <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground">
              No data loaded. Select filters and search to begin.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
