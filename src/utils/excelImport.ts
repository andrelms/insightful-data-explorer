
import { supabase } from "@/integrations/supabase/client";

// Types to match our database schema
interface ConvencaoImport {
  titulo: string;
  tipo: string;
  estado: string | null;
  data_base: string | null;
  vigencia_inicio: string | null;
  vigencia_fim: string | null;
  vale_refeicao: string | null;
  vale_refeicao_valor: number | null;
  assistencia_medica: boolean | null;
  seguro_vida: boolean | null;
  uniforme: boolean | null;
  adicional_noturno: string | null;
  sindicato_id: string | null;
}

interface PisoSalarialImport {
  convenio_id: string;
  cargo: string;
  carga_horaria: string | null;
  piso_salarial: number | null;
  valor_hora_normal: number | null;
  valor_hora_extra_50: number | null;
  valor_hora_extra_100: number | null;
}

interface ParticularidadeImport {
  convenio_id: string;
  descricao: string;
}

interface BeneficioImport {
  convenio_id: string;
  tipo: string;
  valor: string | null;
  descricao: string | null;
}

interface LicencaImport {
  convenio_id: string;
  tipo: string;
  dias: number | null;
  descricao: string | null;
}

// Function to process Excel data
export async function processExcelData(
  excelData: any[], 
  fileName: string,
  importId: string
): Promise<{ success: boolean; message: string; data?: any }> {
  try {
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

    // Process conventions from the Excel data
    const conventions: ConvencaoImport[] = [];
    const pisosSalariais: PisoSalarialImport[] = [];
    const particularidades: ParticularidadeImport[] = [];
    const beneficios: BeneficioImport[] = [];
    const licencas: LicencaImport[] = [];

    // Find and extract data needed for our tables
    for (const row of excelData) {
      // Process each row based on the structure in the Excel file
      // This would need to be customized based on your Excel structure
      
      // Example mapping (simplified - you'll need to adapt to your data structure)
      if (row['SINDICATO']) {
        // Find or create the sindicato
        const { data: sindicatoData, error: sindicatoError } = await supabase
          .from('sindicatos')
          .select('id')
          .eq('nome', row['SINDICATO'])
          .maybeSingle();
          
        let sindicatoId = sindicatoData?.id;
        
        if (!sindicatoId) {
          // Create a new sindicato
          const { data: newSindicato, error: newSindicatoError } = await supabase
            .from('sindicatos')
            .insert({
              nome: row['SINDICATO'],
              cnpj: row['CNPJ'] || null,
              estado: row['ESTADO'] || null,
              site: row['SITE'] || null
            })
            .select('id')
            .single();
            
          if (newSindicatoError) {
            console.error("Erro ao criar sindicato:", newSindicatoError);
          } else {
            sindicatoId = newSindicato.id;
          }
        }
        
        // Create a convention
        const titulo = `CONVENÇÃO COLETIVA ${row['ESTADO'] || ''} - ${row['SINDICATO']}`;
        
        const { data: convencaoData, error: convencaoError } = await supabase
          .from('convencoes')
          .insert({
            titulo: titulo,
            tipo: 'CCT', // Assume all are CCTs
            estado: row['ESTADO'] || null,
            data_base: row['DATA BASE'] ? new Date(row['DATA BASE']).toISOString() : null,
            vigencia_inicio: row['VIGENCIA_INICIO'] ? new Date(row['VIGENCIA_INICIO']).toISOString() : null,
            vigencia_fim: row['VIGENCIA_FIM'] ? new Date(row['VIGENCIA_FIM']).toISOString() : null,
            vale_refeicao: row['VALE REFEIÇÃO'] || null,
            vale_refeicao_valor: row['VALE REFEIÇÃO VALOR'] ? parseFloat(row['VALE REFEIÇÃO VALOR']) : null,
            assistencia_medica: row['ASSISTENCIA MÉDICA'] === 'SIM' || row['ASSISTENCIA MÉDICA'] === true,
            seguro_vida: row['SEGURO DE VIDA'] === 'SIM' || row['SEGURO DE VIDA'] === true,
            uniforme: row['UNIFORME'] === 'SIM' || row['UNIFORME'] === true,
            adicional_noturno: row['ADICIONAL NOTURNO'] || null,
            sindicato_id: sindicatoId
          })
          .select('id')
          .single();
          
        if (convencaoError) {
          console.error("Erro ao criar convenção:", convencaoError);
          continue;
        }
          
        const convenioId = convencaoData.id;
          
        // Process piso salarial if present
        if (row['CARGO'] && (row['PISO SALARIAL'] || row['CARGA HORÁRIA'])) {
          await supabase
            .from('pisos_salariais')
            .insert({
              convenio_id: convenioId,
              cargo: row['CARGO'],
              carga_horaria: row['CARGA HORÁRIA'] || null,
              piso_salarial: row['PISO SALARIAL'] ? parseFloat(row['PISO SALARIAL']) : null,
              valor_hora_normal: row['VALOR HORA NORMAL'] ? parseFloat(row['VALOR HORA NORMAL']) : null,
              valor_hora_extra_50: row['VALOR HORA EXTRA 50%'] ? parseFloat(row['VALOR HORA EXTRA 50%']) : null,
              valor_hora_extra_100: row['VALOR HORA EXTRA 100%'] ? parseFloat(row['VALOR HORA EXTRA 100%']) : null
            });
        }
        
        // Process particularidades if present
        if (row['PARTICULARIDADE']) {
          // Split particularidades if they're separated by commas or pipes
          const particularidadesList = row['PARTICULARIDADE']
            .split(/[,|]/)
            .map((p: string) => p.trim())
            .filter((p: string) => p);
            
          for (const particularidade of particularidadesList) {
            await supabase
              .from('particularidades')
              .insert({
                convenio_id: convenioId,
                descricao: particularidade
              });
          }
        }
      }
    }

    // Update the import status to completed
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
