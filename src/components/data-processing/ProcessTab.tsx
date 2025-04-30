
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FileText, Database } from "lucide-react";

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
            <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
              {processedFile.name.endsWith('.pdf') ? 
                <FileText className="h-10 w-10 text-red-500" /> : 
                <Database className="h-10 w-10 text-green-500" />
              }
              <div>
                <h3 className="font-medium">{processedFile.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {(processedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            
            {isProcessing ? (
              <div className="space-y-2">
                <Progress value={processingProgress} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Processando dados...</span>
                  <span>{processingProgress}%</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col space-y-4">
                <p className="text-sm">
                  O arquivo será processado para extrair informações estruturadas.
                  Este processo inclui:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Extração de dados de convenções coletivas</li>
                  <li>Identificação de sindicatos e seus CNPJs</li>
                  <li>Estruturação de dados salariais por categoria</li>
                  <li>Organização por estados e regiões</li>
                </ul>
                <Button onClick={startProcessing} className="w-full mt-4">
                  Iniciar Processamento
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
