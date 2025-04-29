import React, { useState, useEffect } from "react";
import { FileUpload } from "@/components/dashboard/FileUpload";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FileText, Database, UploadCloud, Check, RefreshCw, AlertCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface ProcessingResult {
  registrosProcessados: number;
  convencoes: number;
  estados: number[];
  status: "success" | "error";
  message?: string;
}

const ProcessarDados = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("upload");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processedFile, setProcessedFile] = useState<File | null>(null);
  const [importId, setImportId] = useState<string | null>(null);
  const [processingResult, setProcessingResult] = useState<ProcessingResult | null>(null);
  
  const handleFileUploaded = async (file: File) => {
    try {
      // Create a record of the uploaded file
      const fileSize = file.size;
      const fileType = file.type;
      const filename = file.name;
      
      const { data: fileData, error: fileError } = await supabase
        .from('uploaded_files')
        .insert({
          filename,
          file_size: fileSize,
          file_type: fileType,
          processed: false
        })
        .select()
        .single();
        
      if (fileError) {
        throw fileError;
      }
      
      // Create a history record for the import process
      const { data: historyData, error: historyError } = await supabase
        .from('historico_importacao')
        .insert({
          origem: `Upload manual - ${filename}`,
          status: 'em_andamento',
          registros_processados: 0
        })
        .select()
        .single();
      
      if (historyError) {
        throw historyError;
      }
      
      setProcessedFile(file);
      setImportId(historyData.id);
      setActiveTab("processar");
      
      toast({
        title: "Arquivo carregado com sucesso",
        description: "O arquivo está pronto para processamento.",
        duration: 3000
      });
    } catch (error) {
      console.error("Erro ao registrar arquivo:", error);
      toast({
        title: "Erro ao carregar arquivo",
        description: "Não foi possível registrar o arquivo no sistema.",
        variant: "destructive",
        duration: 5000
      });
    }
  };

  const simulateProcessing = () => {
    // This function simulates processing progress
    // In a real implementation, this would be handled by a server or background process
    const interval = setInterval(() => {
      setProcessingProgress(prev => {
        const newProgress = prev + 5;
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });
    }, 300);

    return () => clearInterval(interval);
  };

  const startProcessing = async () => {
    if (!processedFile || !importId) return;
    
    setIsProcessing(true);
    setProcessingProgress(0);

    // Start simulation of processing
    const clearSimulation = simulateProcessing();
    
    try {
      // In a real implementation, you would upload and process the file here
      // For now, we're just simulating the processing with a timeout
      
      // Get the file extension to determine processing approach
      const fileExtension = processedFile.name.split('.').pop()?.toLowerCase();
      
      // Generate simulated processing results based on file type
      setTimeout(async () => {
        // This is where processing logic would be implemented
        // For now we're simulating different results based on file type
        const simulatedResult: ProcessingResult = fileExtension === 'pdf' 
          ? {
              registrosProcessados: 23,
              convencoes: 1,
              estados: [1], // A simple count or array of state ids
              status: "success"
            }
          : {
              registrosProcessados: 34,
              convencoes: 6,
              estados: [1, 2, 3, 4], // Simulating multiple states
              status: "success"
            };
            
        // Update the history record to show completed processing
        const { error: updateError } = await supabase
          .from('historico_importacao')
          .update({
            status: 'concluido',
            data_fim: new Date().toISOString(),
            registros_processados: simulatedResult.registrosProcessados,
            detalhes: JSON.stringify({
              tipo_arquivo: fileExtension,
              convencoes_processadas: simulatedResult.convencoes,
              estados_processados: simulatedResult.estados.length,
              timestamp: new Date().toISOString()
            })
          })
          .eq('id', importId);
          
        if (updateError) {
          throw updateError;
        }
        
        // Also mark the file as processed in the uploaded_files table
        await supabase
          .from('uploaded_files')
          .update({
            processed: true,
            processed_at: new Date().toISOString()
          })
          .eq('filename', processedFile.name);
          
        setProcessingResult(simulatedResult);
        setIsProcessing(false);
        setActiveTab("resultados");
        
        toast({
          title: "Processamento concluído",
          description: "Os dados foram extraídos e processados com sucesso!",
          duration: 5000
        });
      }, 3000);
      
    } catch (error) {
      console.error("Erro durante processamento:", error);
      clearSimulation();
      setIsProcessing(false);
      
      // Update the history record to show the error
      if (importId) {
        await supabase
          .from('historico_importacao')
          .update({
            status: 'erro',
            data_fim: new Date().toISOString(),
            detalhes: JSON.stringify({
              erro: error instanceof Error ? error.message : "Erro desconhecido",
              timestamp: new Date().toISOString()
            })
          })
          .eq('id', importId);
      }
      
      toast({
        title: "Erro no processamento",
        description: "Ocorreu um erro ao processar o arquivo. Tente novamente.",
        variant: "destructive",
        duration: 5000
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Processamento de Dados</h1>
        <p className="text-muted-foreground">
          Faça upload de arquivos Excel ou PDF para extrair e processar dados de convenções coletivas.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="upload" disabled={isProcessing}>
            <UploadCloud className="mr-2 h-4 w-4" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="processar" disabled={!processedFile || isProcessing}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Processar
          </TabsTrigger>
          <TabsTrigger value="resultados" disabled={!processedFile || activeTab !== "resultados"}>
            <Check className="mr-2 h-4 w-4" />
            Resultados
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="mt-0">
          <div className="flex justify-center">
            <Card className="w-full max-w-2xl">
              <CardHeader>
                <CardTitle>Upload de Dados</CardTitle>
                <CardDescription>
                  Faça upload de arquivos Excel ou PDF com dados de convenções coletivas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUpload acceptedFileTypes={['excel', 'pdf']} onUploadSuccess={handleFileUploaded} />
                <div className="mt-4 p-4 bg-muted/30 rounded text-sm">
                  <div className="flex items-center gap-2 mb-2 text-primary font-medium">
                    <AlertCircle className="h-4 w-4" />
                    <span>Tipos de arquivos suportados:</span>
                  </div>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-green-500" />
                      <span>Excel (.xlsx, .xls): Dados tabulares estruturados de convenções</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-red-500" />
                      <span>PDF (.pdf): Documentos de convenções coletivas</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="processar" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Processamento com IA</CardTitle>
              <CardDescription>
                O arquivo será processado pela IA para extrair dados estruturados das convenções coletivas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {processedFile && <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                    {processedFile.name.endsWith('.pdf') ? <FileText className="h-10 w-10 text-red-500" /> : <Database className="h-10 w-10 text-green-500" />}
                    <div>
                      <h3 className="font-medium">{processedFile.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {(processedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  
                  {isProcessing ? <div className="space-y-2">
                      <Progress value={processingProgress} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Processando dados...</span>
                        <span>{processingProgress}%</span>
                      </div>
                    </div> : <div className="flex flex-col space-y-4">
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
                    </div>}
                </div>}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="resultados" className="mt-0">
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
                    <Button variant="outline" onClick={() => setActiveTab("upload")}>
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProcessarDados;
