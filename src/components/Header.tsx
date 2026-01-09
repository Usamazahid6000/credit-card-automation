import { CreditCard, RotateCcw, Download, FolderArchive } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="container flex items-center justify-between h-16 px-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
            <CreditCard className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="font-semibold text-foreground">CC OCR Validator</h1>
            <p className="text-xs text-muted-foreground">Automated Credit Card OCR & Validation</p>
          </div>
        </div>
        
        <nav className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            <span className="w-2 h-2 rounded-full bg-muted-foreground mr-2" />
            Redaction Pipeline
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10">
            <Download className="h-4 w-4 mr-2" />
            Download CSV
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            <FolderArchive className="h-4 w-4 mr-2" />
            Redacted ZIP (0 folders)
          </Button>
        </nav>
      </div>
    </header>
  );
}
