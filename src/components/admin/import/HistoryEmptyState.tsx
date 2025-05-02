
import { AlertCircle } from "lucide-react";

export function HistoryEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
      <h3 className="text-lg font-medium">Nenhum registro encontrado</h3>
      <p className="text-sm text-muted-foreground mt-1">
        O histórico de importações está vazio ou foi limpo recentemente.
      </p>
    </div>
  );
}
