
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { MetricsGrid } from "@/components/data-processing/processing-metrics/MetricsGrid";
import { SuccessMessage } from "@/components/data-processing/processing-results/SuccessMessage";
import { ActionButtons } from "@/components/data-processing/processing-results/ActionButtons";

interface ProcessingResult {
  registrosProcessados: number;
  convencoes: number;
  estados: number[];
  status: "success" | "error";
  message?: string;
}

interface ResultsTabProps {
  processingResult: ProcessingResult | null;
  processedFile: File | null;
  onRestart: () => void;
}

export function ResultsTab({ processingResult, processedFile, onRestart }: ResultsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resultados do Processamento</CardTitle>
        <CardDescription>
          Dados extraídos do arquivo {processedFile?.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="p-4 border rounded-lg">
            <SuccessMessage fileName={processedFile?.name || ''} />
            
            <MetricsGrid processingResult={processingResult} />
            
            <ActionButtons onRestart={onRestart} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
