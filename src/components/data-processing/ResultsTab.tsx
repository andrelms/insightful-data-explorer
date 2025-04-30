
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  
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
            <h3 className="font-medium text-green-500 mb-2">Processamento concluído com sucesso!</h3>
            <p className="text-sm mb-4">
              Os dados foram extraídos e processados. Agora você pode visualizá-los no painel ou realizar análises adicionais.
            </p>
            
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
            
            <div className="flex justify-between mt-6 pt-4 border-t">
              <Button variant="outline" onClick={onRestart}>
                Processar Novo Arquivo
              </Button>
              <Button onClick={() => navigate("/convencoes")}>
                Visualizar Convenções
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
