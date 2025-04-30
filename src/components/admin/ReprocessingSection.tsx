
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Book, PlusCircle, RefreshCw } from "lucide-react";

interface ReprocessingSectionProps {
  uploadedFiles: any[];
  isLoading: boolean;
  isReprocessing: boolean;
  onReprocess: (fileId: string, useAI: boolean) => void;
}

export function ReprocessingSection({ 
  uploadedFiles, 
  isLoading, 
  isReprocessing, 
  onReprocess 
}: ReprocessingSectionProps) {
  const [selectedFileId, setSelectedFileId] = useState<string>("");
  const [isUsingAI, setIsUsingAI] = useState(true);

  const handleReprocess = () => {
    onReprocess(selectedFileId, isUsingAI);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          Reprocessar Dados
        </CardTitle>
        <CardDescription>
          Reprocesse arquivos já enviados utilizando extração padrão ou com inteligência artificial.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="file-select">Selecione o arquivo para reprocessar</Label>
          <Select 
            value={selectedFileId}
            onValueChange={setSelectedFileId}
            disabled={isLoading || isReprocessing}
          >
            <SelectTrigger id="file-select">
              <SelectValue placeholder="Selecione um arquivo" />
            </SelectTrigger>
            <SelectContent>
              {uploadedFiles.length > 0 ? (
                uploadedFiles.map(file => (
                  <SelectItem key={file.id} value={file.id}>
                    {file.filename}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-files" disabled>Nenhum arquivo disponível</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="use-ai"
            checked={isUsingAI}
            onChange={() => setIsUsingAI(!isUsingAI)}
            className="rounded border-gray-300 text-primary focus:ring-primary"
          />
          <Label htmlFor="use-ai" className="cursor-pointer">
            Usar Gemini AI para extração inteligente de dados
          </Label>
        </div>
        
        {isUsingAI && (
          <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
            <div className="flex items-start gap-2">
              <Book className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-blue-700 dark:text-blue-300">Processamento com Gemini AI</h3>
                <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                  O processamento com Gemini AI utiliza inteligência artificial avançada para extrair dados estruturados de documentos
                  não estruturados, convertendo-os em um formato JSON que será inserido no banco de dados.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="pt-4">
          <Button 
            onClick={handleReprocess} 
            disabled={!selectedFileId || isReprocessing}
            className="w-full"
          >
            {isReprocessing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Reprocessando...
              </>
            ) : (
              <>
                <PlusCircle className="h-4 w-4 mr-2" />
                Iniciar Reprocessamento
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
