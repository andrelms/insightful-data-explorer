
import React, { useState } from "react";
import { FileUpload } from "@/components/dashboard/FileUpload";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FileText, Database, UploadCloud, Check, RefreshCw } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const ProcessarDados = () => {
  const [activeTab, setActiveTab] = useState("upload");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processedFile, setProcessedFile] = useState<File | null>(null);

  const handleFileUploaded = (file: File) => {
    setProcessedFile(file);
    setActiveTab("processar");
  };

  const startProcessing = () => {
    if (!processedFile) return;
    setIsProcessing(true);
    setProcessingProgress(0);

    // Simulate processing progress
    const interval = setInterval(() => {
      setProcessingProgress(prev => {
        const newProgress = prev + 5;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsProcessing(false);
            setActiveTab("resultados");
            toast({
              title: "Processamento concluído",
              description: "Os dados foram extraídos e processados com sucesso!",
              duration: 5000
            });
          }, 1000);
          return 100;
        }
        return newProgress;
      });
    }, 300);
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
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Upload de Dados</CardTitle>
                <CardDescription>
                  Faça upload de arquivos Excel com dados de convenções coletivas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUpload acceptedFileTypes={['excel']} onUploadSuccess={handleFileUploaded} />
              </CardContent>
            </Card>
            
            
          </div>
        </TabsContent>
        
        <TabsContent value="processar" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Processamento com Gemini Pro 2.5</CardTitle>
              <CardDescription>
                O arquivo será processado pelo Gemini Pro 2.5 para extrair dados estruturados
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
                        <span>Processando com Gemini Pro 2.5...</span>
                        <span>{processingProgress}%</span>
                      </div>
                    </div> : <div className="flex flex-col space-y-4">
                      <p className="text-sm">
                        O arquivo será processado usando o Gemini Pro 2.5 para extrair informações estruturadas.
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
                      <p className="text-3xl font-bold">28</p>
                      <p className="text-sm text-muted-foreground">Registros extraídos</p>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg flex flex-col items-center justify-center">
                      <p className="text-3xl font-bold">6</p>
                      <p className="text-sm text-muted-foreground">Convenções identificadas</p>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg flex flex-col items-center justify-center">
                      <p className="text-3xl font-bold">4</p>
                      <p className="text-sm text-muted-foreground">Estados abrangidos</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-6 pt-4 border-t">
                    <Button variant="outline" onClick={() => setActiveTab("upload")}>
                      Processar Novo Arquivo
                    </Button>
                    <Button onClick={() => window.location.href = "/dashboard"}>
                      Visualizar no Dashboard
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
