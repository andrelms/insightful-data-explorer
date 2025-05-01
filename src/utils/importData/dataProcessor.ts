
import { supabase } from "@/integrations/supabase/client";
import { addSystemLog } from './logger';
import { 
  ConvencaoImport, 
  PisoSalarialImport, 
  ParticularidadeImport, 
  ProcessingContext 
} from './types';

// Process and save a single data row to database
export async function processDataRow(row: any, context: ProcessingContext): Promise<{
  convention: ConvencaoImport | null;
  pisosSalariais: PisoSalarialImport[];
  particularidades: ParticularidadeImport[];
}> {
  // Initialize return objects
  const result = {
    convention: null,
    pisosSalariais: [] as PisoSalarialImport[],
    particularidades: [] as ParticularidadeImport[]
  };

  try {
    if (!row['SINDICATO']) {
      return result; // Skip rows without a sindicato
    }

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
        await addSystemLog('ERROR', `Erro ao criar sindicato: ${newSindicatoError.message}`, 'import');
        return result;
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
        sindicato_id: sindicatoId,
        dados_brutos: row
      })
      .select('id')
      .single();
      
    if (convencaoError) {
      console.error("Erro ao criar convenção:", convencaoError);
      await addSystemLog('ERROR', `Erro ao criar convenção: ${convencaoError.message}`, 'import');
      return result;
    }
      
    const convenioId = convencaoData.id;
    
    // Add to the return list
    result.convention = {
      titulo: titulo,
      tipo: 'CCT',
      estado: row['ESTADO'] || null,
      data_base: row['DATA BASE'] || null,
      vigencia_inicio: row['VIGENCIA_INICIO'] || null,
      vigencia_fim: row['VIGENCIA_FIM'] || null,
      vale_refeicao: row['VALE REFEIÇÃO'] || null,
      vale_refeicao_valor: row['VALE REFEIÇÃO VALOR'] ? parseFloat(row['VALE REFEIÇÃO VALOR']) : null,
      assistencia_medica: row['ASSISTENCIA MÉDICA'] === 'SIM' || row['ASSISTENCIA MÉDICA'] === true,
      seguro_vida: row['SEGURO DE VIDA'] === 'SIM' || row['SEGURO DE VIDA'] === true,
      uniforme: row['UNIFORME'] === 'SIM' || row['UNIFORME'] === true,
      adicional_noturno: row['ADICIONAL NOTURNO'] || null,
      sindicato_id: sindicatoId
    };
      
    // Process piso salarial if present
    if (row['CARGO'] && (row['PISO SALARIAL'] || row['CARGA HORÁRIA'])) {
      const pisoData = {
        convenio_id: convenioId,
        cargo: row['CARGO'],
        carga_horaria: row['CARGA HORÁRIA'] || null,
        piso_salarial: row['PISO SALARIAL'] ? parseFloat(row['PISO SALARIAL']) : null,
        valor_hora_normal: row['VALOR HORA NORMAL'] ? parseFloat(row['VALOR HORA NORMAL']) : null,
        valor_hora_extra_50: row['VALOR HORA EXTRA 50%'] ? parseFloat(row['VALOR HORA EXTRA 50%']) : null,
        valor_hora_extra_100: row['VALOR HORA EXTRA 100%'] ? parseFloat(row['VALOR HORA EXTRA 100%']) : null
      };
      
      await supabase
        .from('pisos_salariais')
        .insert(pisoData);
        
      result.pisosSalariais.push(pisoData);
    }
    
    // Process particularidades if present
    if (row['PARTICULARIDADE']) {
      // Split particularidades if they're separated by commas or pipes
      const particularidadesList = row['PARTICULARIDADE']
        .split(/[,|]/)
        .map((p: string) => p.trim())
        .filter((p: string) => p);
        
      for (const particularidade of particularidadesList) {
        const partData = {
          convenio_id: convenioId,
          descricao: particularidade
        };
        
        await supabase
          .from('particularidades')
          .insert(partData);
          
        result.particularidades.push(partData);
      }
    }

    return result;
  } catch (error) {
    console.error("Erro ao processar linha:", error);
    await addSystemLog('ERROR', `Erro ao processar linha: ${error instanceof Error ? error.message : "Erro desconhecido"}`, 'import');
    return result;
  }
}
