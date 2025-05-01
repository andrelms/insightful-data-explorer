
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { FileCard } from "./FileCard";
import { ProcessingProgress } from "./ProcessingProgress";
import { ProcessInstructions } from "./ProcessInstructions";

interface ProcessTabProps {
  isProcessing: boolean;
  processingProgress: number;
  processedFile: File | null;
  startProcessing: () => void;
}

export function ProcessTab({ 
  isProcessing, 
  processingProgress, 
  processedFile,
  startProcessing 
}: ProcessTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Processamento com IA</CardTitle>
        <CardDescription>
          O arquivo será processado pela IA para extrair dados estruturados das convenções coletivas
        </CardDescription>
      </CardHeader>
      <CardContent>
        {processedFile && (
          <div className="space-y-6">
            <FileCard file={processedFile} />
            
            {isProcessing ? (
              <ProcessingProgress progress={processingProgress} />
            ) : (
              <ProcessInstructions onStartProcessing={startProcessing} />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
