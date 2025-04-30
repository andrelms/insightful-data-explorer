
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadCloud, RefreshCw, Check } from "lucide-react";
import { ProcessingHeader } from "@/components/data-processing/ProcessingHeader";
import { UploadTab } from "@/components/data-processing/UploadTab";
import { ProcessTab } from "@/components/data-processing/ProcessTab";
import { ResultsTab } from "@/components/data-processing/ResultsTab";
import { useDataProcessing } from "@/hooks/useDataProcessing";

const ProcessarDados = () => {
  const {
    activeTab,
    setActiveTab,
    isProcessing,
    processingProgress,
    processedFile,
    processingResult,
    handleFileUploaded,
    startProcessing,
    resetProcess
  } = useDataProcessing();

  return (
    <div className="space-y-6 animate-fade-in">
      <ProcessingHeader />

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
          <UploadTab onFileUploaded={handleFileUploaded} />
        </TabsContent>
        
        <TabsContent value="processar" className="mt-0">
          <ProcessTab 
            isProcessing={isProcessing}
            processingProgress={processingProgress}
            processedFile={processedFile}
            startProcessing={startProcessing}
          />
        </TabsContent>
        
        <TabsContent value="resultados" className="mt-0">
          <ResultsTab 
            processingResult={processingResult}
            processedFile={processedFile}
            onRestart={resetProcess}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProcessarDados;
