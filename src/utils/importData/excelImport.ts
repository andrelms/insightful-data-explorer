
import { supabase } from "@/integrations/supabase/client";
import { addSystemLog } from './logger';
import { processDataBlockWithGemini } from './geminiProcessor';
import { processDataRow } from './dataProcessor';
import { ProcessExcelResult, ProcessingContext } from './types';

// Main function to process Excel data with Gemini 2.5 integration
export async function processExcelData(
  excelData: any[], 
  fileName: string,
  importId: string
): Promise<ProcessExcelResult> {
  try {
    // Log processing start
    await addSystemLog('INFO', `Iniciando processamento do arquivo: ${fileName}`, 'import');
    
    // Create a record for this import operation
    const { error: historyError } = await supabase
      .from('historico_importacao')
      .update({
        status: 'em_andamento',
        detalhes: JSON.stringify({
          arquivo_original: fileName,
          registros_detectados: excelData.length,
          colunas_detectadas: excelData[0] ? Object.keys(excelData[0]).length : 0,
          inicio_processamento: new Date().toISOString()
        })
      })
      .eq('id', importId);

    if (historyError) {
      throw new Error(`Erro ao atualizar histórico: ${historyError.message}`);
    }

    // Get Gemini API key from settings
    const { data: configData, error: configError } = await supabase
      .from('configuracoes')
      .select('valor')
      .eq('chave', 'gemini_api_key')
      .single();
      
    if (configError || !configData?.valor) {
      throw new Error('Chave da API do Gemini não configurada. Por favor, adicione nas configurações do sistema.');
    }
    
    const geminiApiKey = configData.valor;
    
    // Create processing context
    const context: ProcessingContext = {
      fileName,
      importId,
      geminiApiKey
    };
    
    // Arrays to store processed data
    const conventions = [];
    const pisosSalariais = [];
    const particularidades = [];
    const beneficios = [];
    const licencas = [];
    
    // Pre-processing with Gemini 2.5
    // Split data into blocks to handle token limit
    const BLOCK_SIZE = 50; // Adjust as needed
    const dataBlocks = [];
    
    for (let i = 0; i < excelData.length; i += BLOCK_SIZE) {
      dataBlocks.push(excelData.slice(i, i + BLOCK_SIZE));
    }
    
    await addSystemLog('INFO', `Dados divididos em ${dataBlocks.length} blocos para processamento`, 'import');
    
    // Process each block with Gemini
    let processedData = [];
    
    for (let i = 0; i < dataBlocks.length; i++) {
      try {
        await addSystemLog('INFO', `Processando bloco ${i+1} de ${dataBlocks.length}`, 'import');
        
        const blockData = dataBlocks[i];
        
        // Call Gemini API to process the block
        const processedBlock = await processDataBlockWithGemini(blockData, geminiApiKey);
        processedData = [...processedData, ...processedBlock];
        
        // Small delay to respect API rate limits
        if (i < dataBlocks.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error(`Erro ao processar bloco ${i+1}:`, error);
        await addSystemLog('ERROR', `Erro ao processar bloco ${i+1}: ${error instanceof Error ? error.message : "Erro desconhecido"}`, 'import');
        // Continue with next block on error
      }
    }
    
    // If Gemini processing failed, use standard method
    if (processedData.length === 0) {
      await addSystemLog('WARN', 'Falha no processamento com Gemini, usando método padrão', 'import');
      processedData = excelData;
    }
    
    // Process the data (either from Gemini or original)
    for (const row of processedData) {
      const result = await processDataRow(row, context);
      
      if (result.convention) {
        conventions.push(result.convention);
      }
      
      pisosSalariais.push(...result.pisosSalariais);
      particularidades.push(...result.particularidades);
    }

    // Update import status to completed
    await supabase
      .from('historico_importacao')
      .update({
        status: 'concluido',
        data_fim: new Date().toISOString(),
        registros_processados: conventions.length,
        detalhes: JSON.stringify({
          arquivo_original: fileName,
          convencoes_processadas: conventions.length,
          pisos_processados: pisosSalariais.length,
          particularidades_processadas: particularidades.length,
          beneficios_processados: beneficios.length,
          licencas_processadas: licencas.length,
          fim_processamento: new Date().toISOString()
        })
      })
      .eq('id', importId);
      
    await addSystemLog('INFO', `Processamento concluído: ${conventions.length} convenções importadas`, 'import');

    return {
      success: true,
      message: `Processamento concluído com sucesso. ${conventions.length} convenções importadas.`,
      data: {
        conventions: conventions.length,
        pisosSalariais: pisosSalariais.length,
        particularidades: particularidades.length,
        beneficios: beneficios.length,
        licencas: licencas.length
      }
    };
  } catch (error) {
    console.error('Erro ao processar dados do Excel:', error);
    
    await addSystemLog('ERROR', `Erro ao processar dados do Excel: ${error instanceof Error ? error.message : "Erro desconhecido"}`, 'import');
    
    // Update the history to reflect the error
    await supabase
      .from('historico_importacao')
      .update({
        status: 'erro',
        data_fim: new Date().toISOString(),
        detalhes: JSON.stringify({
          arquivo_original: fileName,
          erro: error instanceof Error ? error.message : "Erro desconhecido",
          timestamp: new Date().toISOString()
        })
      })
      .eq('id', importId);
      
    return {
      success: false,
      message: `Erro ao processar dados: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
    };
  }
}
