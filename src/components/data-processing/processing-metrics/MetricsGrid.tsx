
import React from "react";

interface ProcessingResult {
  registrosProcessados: number;
  convencoes: number;
  estados: number[];
}

interface MetricsGridProps {
  processingResult: ProcessingResult | null;
}

export function MetricsGrid({ processingResult }: MetricsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
      <div className="p-3 bg-muted/30 rounded-lg flex flex-col items-center justify-center">
        <p className="text-3xl font-bold">{processingResult?.registrosProcessados || 0}</p>
        <p className="text-sm text-muted-foreground">Registros extraídos</p>
      </div>
      <div className="p-3 bg-muted/30 rounded-lg flex flex-col items-center justify-center">
        <p className="text-3xl font-bold">{processingResult?.convencoes || 0}</p>
        <p className="text-sm text-muted-foreground">Convenções identificadas</p>
      </div>
      <div className="p-3 bg-muted/30 rounded-lg flex flex-col items-center justify-center">
        <p className="text-3xl font-bold">{processingResult?.estados?.length || 0}</p>
        <p className="text-sm text-muted-foreground">Estados abrangidos</p>
      </div>
    </div>
  );
}
