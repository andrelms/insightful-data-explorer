
import { supabase } from "@/integrations/supabase/client";
import { addSystemLog } from './logger';
import { 
  ConvencaoImport, 
  PisoSalarialImport, 
  ParticularidadeImport, 
  ProcessingContext, 
  ProcessingResult 
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
          site: row['SITE'] || null,
          data_base: row['DATA BASE'] || null
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
      .from('convenios')
      .insert({
        descricao: titulo,
        sindicato_id: sindicatoId,
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
      // Primeiro criar o cargo
      const { data: cargoData, error: cargoError } = await supabase
        .from('cargos')
        .insert({
          cargo: row['CARGO'],
          carga_horaria: row['CARGA HORÁRIA'] || null,
          convenio_id: convenioId
        })
        .select('id')
        .single();

      if (cargoError) {
        console.error("Erro ao criar cargo:", cargoError);
        return result;
      }

      // Inserir o piso salarial
      const cargoId = cargoData.id;
      await supabase
        .from('piso_salarial')
        .insert({
          cargo_id: cargoId,
          valor: row['PISO SALARIAL'] ? parseFloat(row['PISO SALARIAL']) : null,
        });
        
      // Inserir valores de hora se existirem
      if (row['VALOR HORA NORMAL'] || row['VALOR HORA EXTRA 50%'] || row['VALOR HORA EXTRA 100%']) {
        if (row['VALOR HORA NORMAL']) {
          await supabase
            .from('valores_hora')
            .insert({
              cargo_id: cargoId,
              tipo: 'normal',
              valor: parseFloat(row['VALOR HORA NORMAL'])
            });
        }
        
        if (row['VALOR HORA EXTRA 50%']) {
          await supabase
            .from('valores_hora')
            .insert({
              cargo_id: cargoId,
              tipo: 'extra_50',
              valor: parseFloat(row['VALOR HORA EXTRA 50%'])
            });
        }
        
        if (row['VALOR HORA EXTRA 100%']) {
          await supabase
            .from('valores_hora')
            .insert({
              cargo_id: cargoId,
              tipo: 'extra_100',
              valor: parseFloat(row['VALOR HORA EXTRA 100%'])
            });
        }
      }
      
      // Add to the processed list
      const pisoData = {
        convenio_id: convenioId,
        cargo: row['CARGO'],
        carga_horaria: row['CARGA HORÁRIA'] || null,
        piso_salarial: row['PISO SALARIAL'] ? parseFloat(row['PISO SALARIAL']) : null,
        valor_hora_normal: row['VALOR HORA NORMAL'] ? parseFloat(row['VALOR HORA NORMAL']) : null,
        valor_hora_extra_50: row['VALOR HORA EXTRA 50%'] ? parseFloat(row['VALOR HORA EXTRA 50%']) : null,
        valor_hora_extra_100: row['VALOR HORA EXTRA 100%'] ? parseFloat(row['VALOR HORA EXTRA 100%']) : null
      };
      
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
        // Precisamos ter um cargo_id para inserir uma particularidade
        // Vamos criar um cargo genérico se não tivermos um
        let cargoId: string;
        
        if (result.pisosSalariais.length > 0) {
          // Use the cargo_id from the latest created piso salarial
          const { data: cargoData } = await supabase
            .from('cargos')
            .select('id')
            .eq('convenio_id', convenioId)
            .limit(1);
            
          cargoId = cargoData?.[0]?.id;
        } else {
          // Create a generic cargo
          const { data: cargoData } = await supabase
            .from('cargos')
            .insert({
              cargo: 'Geral',
              convenio_id: convenioId
            })
            .select('id')
            .single();
            
          cargoId = cargoData.id;
        }
        
        // Now insert the particularidade with the cargo_id
        await supabase
          .from('particularidades')
          .insert({
            cargo_id: cargoId,
            conteudo: particularidade,
            categoria: 'Geral',
            file_id: 'placeholder-file-id'
          });
        
        // Add to processed list
        const partData = {
          cargo_id: cargoId,
          conteudo: particularidade,
          categoria: 'Geral'
        };
        
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

export const processDataWithGemini = async (
  fileId: string,
  jsonData: any,
  apiKey: string
): Promise<ProcessingResult> => {
  try {
    const particularidades = jsonData.particularidades || [];
    const convenio = jsonData.convenio || null;

    // Processar particularidades
    if (particularidades.length > 0) {
      const particularidadesData = particularidades.map((part: any) => ({
        cargo_id: part.cargo_id,
        conteudo: part.conteudo,
        categoria: part.categoria,
        file_id: fileId,
        convenio_id: convenio?.id || null
      }));

      const { error: particularidadesError } = await supabase
        .from('particularidades')
        .insert(particularidadesData);

      if (particularidadesError) {
        console.error('Erro ao inserir particularidades:', particularidadesError);
        throw particularidadesError;
      }
    }

    return {
      convention: null,
      pisosSalariais: [],
      particularidades: []
    };
  } catch (error) {
    console.error("Erro ao processar linha:", error);
    await addSystemLog('ERROR', `Erro ao processar linha: ${error instanceof Error ? error.message : "Erro desconhecido"}`, 'import');
    return {
      convention: null,
      pisosSalariais: [],
      particularidades: []
    };
  }
};
