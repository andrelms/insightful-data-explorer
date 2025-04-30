
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUpload } from "@/components/dashboard/FileUpload";
import { AlertCircle, Upload } from "lucide-react";
import { useState } from "react";

interface FileUploadSectionProps {
  onUploadSuccess: (file: File) => void;
}

export function FileUploadSection({ onUploadSuccess }: FileUploadSectionProps) {
  const [selectedFileType, setSelectedFileType] = useState<string>("excel");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Importação de Dados
        </CardTitle>
        <CardDescription>
          Importe dados de convenções coletivas a partir de arquivos Excel ou PDF.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="file-type">Tipo de Arquivo</Label>
          <Select 
            value={selectedFileType}
            onValueChange={setSelectedFileType}
          >
            <SelectTrigger id="file-type">
              <SelectValue placeholder="Selecione o tipo de arquivo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="excel">Planilha Excel</SelectItem>
              <SelectItem value="pdf">Documento PDF</SelectItem>
              <SelectItem value="csv">Arquivo CSV</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <FileUpload 
          acceptedFileTypes={selectedFileType === 'excel' ? ['excel'] : selectedFileType === 'pdf' ? ['pdf'] : ['csv']} 
          onUploadSuccess={onUploadSuccess} 
        />
        
        <div className="bg-muted/30 p-4 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium">Informações de Importação</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Os arquivos serão processados para extrair dados de convenções coletivas. 
                O sistema tentará identificar sindicatos, cargos, pisos salariais e
                outras informações relevantes.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
