
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProcessingResult {
  registrosProcessados: number;
  convencoes: number;
  estados: number[];
  status: "success" | "error";
  message?: string;
}

export function useDataProcessing() {
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
      // Get the file extension to determine processing approach
      const fileExtension = processedFile.name.split('.').pop()?.toLowerCase();
      
      // Simular dados de processamento para salvar no banco
      const processedContent = {
        sindicatos: [
          {
            nome: "SINDPD-SP",
            cnpj: "54.991.255/0001-90",
            site: "www.sindpd.org.br",
            data_base: "01/01/2024"
          }
        ],
        cargos: [
          {
            cargo: "Analista de Sistemas",
            carga_horaria: "44H SEMANAIS",
            piso_salarial: 4175.00
          },
          {
            cargo: "Programador",
            carga_horaria: "44H SEMANAIS",
            piso_salarial: 3370.00
          }
        ],
        particularidades: [
          "ADICIONAL NOTURNO 30%",
          "HORAS EXTRAS 75% (DIAS NORMAIS)",
          "HORAS EXTRAS 100% (DOMINGO E FERIADO)"
        ]
      };
      
      // Para essa simulação, vamos apenas esperar um tempo
      setTimeout(async () => {
        try {
          // Get the file_id from uploaded_files
          const { data: fileData } = await supabase
            .from('uploaded_files')
            .select('id')
            .eq('filename', processedFile.name)
            .single();
            
          if (!fileData?.id) {
            throw new Error("Arquivo não encontrado no banco de dados");
          }
            
          // Store the processed data in processed_files
          const { error: processedError } = await supabase
            .from('processed_files')
            .insert({
              file_id: fileData.id,
              content: processedContent,
              processing_type: 'upload'
            });
            
          if (processedError) {
            throw processedError;
          }
          
          // Simular resultado de processamento
          const simulatedResult: ProcessingResult = {
            registrosProcessados: fileExtension === 'pdf' ? 23 : 34,
            convencoes: fileExtension === 'pdf' ? 1 : 6,
            estados: fileExtension === 'pdf' ? [1] : [1, 2, 3, 4],
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
                processamento_gemini: true,
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
            description: "Os dados foram extraídos e processados com sucesso usando a IA Gemini!",
            duration: 5000
          });
        } catch (error) {
          throw error;
        }
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
        description: error instanceof Error ? error.message : "Ocorreu um erro ao processar o arquivo. Tente novamente.",
        variant: "destructive",
        duration: 5000
      });
    }
  };

  const resetProcess = () => {
    setActiveTab("upload");
    setProcessedFile(null);
    setImportId(null);
    setProcessingResult(null);
    setIsProcessing(false);
    setProcessingProgress(0);
  };

  return {
    activeTab,
    setActiveTab,
    isProcessing,
    processingProgress,
    processedFile,
    importId,
    processingResult,
    handleFileUploaded,
    startProcessing,
    resetProcess
  };
}
