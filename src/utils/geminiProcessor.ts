
import { supabase } from "@/integrations/supabase/client";

interface ProcessingOptions {
  fileId: string;
  useAI: boolean;
  historyId: string;
}

interface ProcessingResult {
  success: boolean;
  recordsProcessed: number;
  error?: string;
  details?: any;
}

export async function processFileWithGemini(options: ProcessingOptions): Promise<ProcessingResult> {
  const { fileId, useAI, historyId } = options;

  try {
    // First, get file info from database
    const { data: fileData, error: fileError } = await supabase
      .from('uploaded_files')
      .select('*')
      .eq('id', fileId)
      .single();

    if (fileError || !fileData) {
      throw new Error("Arquivo não encontrado");
    }

    // Check if we have a Gemini API key (only if using AI)
    if (useAI) {
      const { data: configData, error: configError } = await supabase
        .from('configuracoes')
        .select('valor')
        .eq('chave', 'gemini_api_key')
        .single();

      if (configError || !configData?.valor) {
        throw new Error("Chave da API Gemini não configurada");
      }
    }

    // Simulate processing with or without AI
    // In a real implementation, this would call the Gemini API or use standard extraction logic
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing time

    // Generate sample extracted data
    const extractedData = generateSampleData(fileData.filename, useAI);
    
    // Save extracted data to database (in a real implementation)
    // For demonstration, we'll just return the result
    
    // Update the history record with completion information
    await supabase
      .from('historico_importacao')
      .update({
        status: 'concluido',
        data_fim: new Date().toISOString(),
        registros_processados: extractedData.recordsCount,
        detalhes: JSON.stringify({
          modo_processamento: useAI ? "Gemini AI" : "Extração padrão",
          tipo_arquivo: fileData.file_type,
          registros_encontrados: extractedData.recordsCount,
          convencoes_processadas: extractedData.conventionsCount,
          estados_processados: extractedData.statesCount,
          timestamp: new Date().toISOString()
        })
      })
      .eq('id', historyId);
      
    // Mark the file as processed
    await supabase
      .from('uploaded_files')
      .update({
        processed: true,
        processed_at: new Date().toISOString()
      })
      .eq('id', fileId);

    return {
      success: true,
      recordsProcessed: extractedData.recordsCount,
      details: extractedData
    };
  } catch (error) {
    console.error("Erro ao processar arquivo:", error);
    
    // Update the history record with error information
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
      .eq('id', historyId);
      
    return {
      success: false,
      recordsProcessed: 0,
      error: error instanceof Error ? error.message : "Erro desconhecido"
    };
  }
}

function generateSampleData(filename: string, isAI: boolean) {
  // Generate more comprehensive data if AI processing was used
  const recordsCount = isAI ? Math.floor(Math.random() * 30) + 10 : Math.floor(Math.random() * 15) + 5;
  const conventionsCount = Math.ceil(recordsCount / 3);
  const statesCount = Math.min(Math.ceil(recordsCount / 5), 5);
  
  // This is where we would normally process and extract data
  // For demonstration purposes, we're just generating sample data
  return {
    recordsCount,
    conventionsCount,
    statesCount,
    sample: {
      sindicatos: [
        {
          nome: "SINDPD-SP",
          cnpj: "54.991.255/0001-90",
          site: "www.sindpd.org.br"
        }
      ],
      convencoes: [
        {
          titulo: "Convenção Coletiva SINDPD 2024-2025",
          tipo: "CCT",
          data_base: "2024-01-01",
          vigencia_inicio: "2024-01-01",
          vigencia_fim: "2025-12-31"
        }
      ],
      pisos: [
        {
          cargo: "Analista de Sistemas",
          piso_salarial: 4175.00,
          carga_horaria: "44H SEMANAIS"
        },
        {
          cargo: "Programador",
          piso_salarial: 3370.00,
          carga_horaria: "44H SEMANAIS"
        }
      ]
    }
  };
}
