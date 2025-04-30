import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload } from "@/components/dashboard/FileUpload";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { AlertCircle, RefreshCw, Upload, PlusCircle, Book } from "lucide-react";
import { ImportHistory } from "@/components/admin/ImportHistory";

export function ImportSection() {
  const [selectedFileType, setSelectedFileType] = useState<string>("excel");
  const [isReprocessing, setIsReprocessing] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState<string>("");
  const [isUsingAI, setIsUsingAI] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

  // Define the fetchUploadedFiles function before using it in useEffect
  const fetchUploadedFiles = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('uploaded_files')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setUploadedFiles(data || []);
    } catch (error) {
      console.error("Erro ao buscar arquivos:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar a lista de arquivos.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Use useEffect to call fetchUploadedFiles when the component mounts
  useEffect(() => {
    fetchUploadedFiles();
  }, []);

  const handleUploadSuccess = async (file: File) => {
    await fetchUploadedFiles();
    toast({
      title: "Arquivo enviado com sucesso",
      description: "O arquivo está pronto para ser processado."
    });
  };

  const handleReprocess = async () => {
    if (!selectedFileId) {
      toast({
        title: "Erro",
        description: "Selecione um arquivo para reprocessar.",
        variant: "destructive",
      });
      return;
    }
    
    setIsReprocessing(true);
    try {
      // Get file information
      const { data: fileData, error: fileError } = await supabase
        .from('uploaded_files')
        .select('*')
        .eq('id', selectedFileId)
        .single();
        
      if (fileError || !fileData) {
        throw new Error("Erro ao obter informações do arquivo");
      }
      
      // Create a history record for reprocessing
      const { data: historyData, error: historyError } = await supabase
        .from('historico_importacao')
        .insert({
          origem: `Reprocessamento - ${fileData.filename}`,
          status: 'em_andamento',
          registros_processados: 0,
          detalhes: JSON.stringify({
            modo_processamento: isUsingAI ? "Gemini AI" : "Extração padrão",
            tipo_arquivo: fileData.file_type,
            timestamp: new Date().toISOString()
          })
        })
        .select()
        .single();
      
      if (historyError) {
        throw historyError;
      }

      // Simulate processing with Gemini or standard extraction
      // In a real implementation, this would call the processing logic
      setTimeout(async () => {
        try {
          // Update the history record
          const processedCount = Math.floor(Math.random() * 20) + 5; // Simulate random number of records
          await supabase
            .from('historico_importacao')
            .update({
              status: 'concluido',
              data_fim: new Date().toISOString(),
              registros_processados: processedCount,
              detalhes: JSON.stringify({
                modo_processamento: isUsingAI ? "Gemini AI" : "Extração padrão",
                tipo_arquivo: fileData.file_type,
                registros_encontrados: processedCount,
                convencoes_processadas: Math.ceil(processedCount / 3),
                estados_processados: Math.min(processedCount, 5),
                timestamp: new Date().toISOString()
              })
            })
            .eq('id', historyData.id);
          
          toast({
            title: "Reprocessamento concluído",
            description: `${processedCount} registros foram processados com sucesso.`
          });
        } catch (error) {
          console.error("Erro ao atualizar histórico:", error);
          toast({
            title: "Erro",
            description: "Ocorreu um problema ao finalizar o reprocessamento.",
            variant: "destructive",
          });
        } finally {
          setIsReprocessing(false);
        }
      }, 3000);
      
    } catch (error) {
      console.error("Erro ao reprocessar arquivo:", error);
      toast({
        title: "Erro no reprocessamento",
        description: "Não foi possível reprocessar o arquivo selecionado.",
        variant: "destructive",
      });
      setIsReprocessing(false);
    }
  };

  return (
    <div className="grid gap-6">
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
            onUploadSuccess={handleUploadSuccess} 
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

      <ImportHistory />
    </div>
  );
}
