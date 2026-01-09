import { Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface StatusSectionProps {
  processed: number;
  total: number;
}

export function StatusSection({ processed, total }: StatusSectionProps) {
  const percentage = total > 0 ? Math.round((processed / total) * 100) : 0;

  return (
    <section className="space-y-4">
      <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        2. PROCESS STATUS
      </h2>
      
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <span className="font-medium text-foreground">Ready to process</span>
        </div>
        
        <Progress value={percentage} className="h-1 mb-3" />
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{processed} / {total} rows</span>
          <span>{percentage}%</span>
        </div>
      </div>
    </section>
  );
}
