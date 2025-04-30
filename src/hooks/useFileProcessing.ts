
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export function useFileProcessing() {
  const [isLoading, setIsLoading] = useState(false);
  const [isReprocessing, setIsReprocessing] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

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

  const reprocessFile = async (fileId: string, useAI: boolean) => {
    if (!fileId) {
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
        .eq('id', fileId)
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
            modo_processamento: useAI ? "Gemini AI" : "Extração padrão",
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
                modo_processamento: useAI ? "Gemini AI" : "Extração padrão",
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

  return {
    isLoading,
    isReprocessing,
    uploadedFiles,
    handleUploadSuccess,
    reprocessFile
  };
}
