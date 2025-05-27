
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
  cargo_id: string;
  categoria: string | null;
  conteudo: string | null;
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

// Function to process Excel data with Gemini 2.5 integration
export async function processExcelData(
  excelData: any[], 
  fileName: string,
  importId: string
): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    // Log inicio do processamento
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

    // Obter a chave da API do Gemini das configurações
    const { data: configData, error: configError } = await supabase
      .from('configuracoes')
      .select('valor')
      .eq('chave', 'gemini_api_key')
      .single();
      
    if (configError || !configData?.valor) {
      throw new Error('Chave da API do Gemini não configurada. Por favor, adicione nas configurações do sistema.');
    }
    
    const geminiApiKey = configData.valor;
    
    // Arrays para armazenar os dados processados
    const conventions: ConvencaoImport[] = [];
    const pisosSalariais: PisoSalarialImport[] = [];
    const particularidades: ParticularidadeImport[] = [];
    const beneficios: BeneficioImport[] = [];
    const licencas: LicencaImport[] = [];
    
    // Pré-processamento com Gemini 2.5
    // Dividir os dados em blocos para lidar com o limite de tokens
    const BLOCK_SIZE = 50; // Ajustar conforme necessário
    const dataBlocks = [];
    
    for (let i = 0; i < excelData.length; i += BLOCK_SIZE) {
      dataBlocks.push(excelData.slice(i, i + BLOCK_SIZE));
    }
    
    await addSystemLog('INFO', `Dados divididos em ${dataBlocks.length} blocos para processamento`, 'import');
    
    // Processar cada bloco com o Gemini
    let processedData = [];
    
    for (let i = 0; i < dataBlocks.length; i++) {
      try {
        await addSystemLog('INFO', `Processando bloco ${i+1} de ${dataBlocks.length}`, 'import');
        
        const blockData = dataBlocks[i];
        
        // Chamar a API do Gemini para processar o bloco
        const processedBlock = await processDataBlockWithGemini(blockData, geminiApiKey);
        processedData = [...processedData, ...processedBlock];
        
        // Pequeno delay para respeitar limites de taxa da API
        if (i < dataBlocks.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error(`Erro ao processar bloco ${i+1}:`, error);
        await addSystemLog('ERROR', `Erro ao processar bloco ${i+1}: ${error instanceof Error ? error.message : "Erro desconhecido"}`, 'import');
        // Continuar com o próximo bloco em caso de erro
      }
    }
    
    // Se não conseguiu processar com o Gemini, usar o método padrão
    if (processedData.length === 0) {
      await addSystemLog('WARN', 'Falha no processamento com Gemini, usando método padrão', 'import');
      processedData = excelData;
    }
    
    // Processar os dados (seja do Gemini ou o original)
    for (const row of processedData) {
      // Process each row based on the structure in the Excel file
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
              site: row['SITE'] || null,
              data_base: row['DATA BASE'] || null
            })
            .select('id')
            .single();
            
          if (newSindicatoError) {
            console.error("Erro ao criar sindicato:", newSindicatoError);
            await addSystemLog('ERROR', `Erro ao criar sindicato: ${newSindicatoError.message}`, 'import');
          } else {
            sindicatoId = newSindicato.id;
          }
        }
        
        // Create a convention
        const titulo = `CONVENÇÃO COLETIVA ${row['ESTADO'] || ''} - ${row['SINDICATO']}`;
        
        // Inserir no banco usando a tabela correta: convenios
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
          continue;
        }
          
        const convenioId = convencaoData.id;
        
        // Adicionar à lista
        conventions.push({
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
        });
          
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
            continue;
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
          pisosSalariais.push({
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
            // Precisamos ter um cargo_id para inserir uma particularidade
            // Vamos criar um cargo genérico se não tivermos um
            let cargoId: string;
            
            if (pisosSalariais.length > 0) {
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
                categoria: 'Geral'
              });
            
            // Add to processed list
            particularidades.push({
              cargo_id: cargoId,
              categoria: 'Geral',
              conteudo: particularidade
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

// Função para processar blocos de dados utilizando API do Gemini 2.5
async function processDataBlockWithGemini(dataBlock: any[], apiKey: string): Promise<any[]> {
  try {
    // Preparar a mensagem para o Gemini
    const systemPrompt = `
      Você é um especialista em processamento de dados de convenções coletivas trabalhistas. 
      Sua tarefa é analisar, estruturar e enriquecer os dados brutos de convenções coletivas.
      
      Para cada entrada nos dados:
      1. Identifique e normalize os campos principais: SINDICATO, ESTADO, DATA BASE, VIGENCIA_INICIO, VIGENCIA_FIM
      2. Estruture corretamente os dados de pisos salariais por cargo, incluindo:
         - CARGO, CARGA HORÁRIA, PISO SALARIAL
         - Calcule VALOR HORA NORMAL, VALOR HORA EXTRA 50%, VALOR HORA EXTRA 100% quando disponíveis
      3. Extraia informações sobre benefícios:
         - VALE REFEIÇÃO (normalize para um formato padrão)
         - VALE REFEIÇÃO VALOR (extraia apenas o valor numérico)
         - ASSISTENCIA MÉDICA (normalize para SIM/NÃO)
         - SEGURO DE VIDA (normalize para SIM/NÃO)
         - UNIFORME (normalize para SIM/NÃO)
      4. Identifique particularidades e licenças, organizando-as adequadamente
      5. Complete dados faltantes com base em convenções similares quando possível
      
      Retorne os dados estruturados no mesmo formato que recebeu, porém com as correções e enriquecimentos.
    `;
    
    // Preparar o payload para a API
    const payload = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: systemPrompt + "\n\nDados para processar:\n" + JSON.stringify(dataBlock)
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.1,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      }
    };
    
    // Chamar a API do Gemini
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      throw new Error(`Erro na API do Gemini: ${response.status} ${response.statusText}`);
    }
    
    const responseData = await response.json();
    
    // Extrair e processar a resposta
    if (responseData.candidates && responseData.candidates[0]?.content?.parts?.[0]?.text) {
      const responseText = responseData.candidates[0].content.parts[0].text;
      
      // Tentar extrair o JSON da resposta
      const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || 
                        responseText.match(/```\n([\s\S]*?)\n```/) ||
                        responseText.match(/\[([\s\S]*?)\]/);
      
      if (jsonMatch && jsonMatch[1]) {
        try {
          let jsonStr = jsonMatch[1];
          // Se for um array simples sem colchetes, adicionar colchetes
          if (!jsonStr.trim().startsWith('[')) {
            jsonStr = '[' + jsonStr + ']';
          }
          return JSON.parse(jsonStr);
        } catch (error) {
          console.error("Erro ao fazer parse da resposta JSON:", error);
          throw new Error("Falha ao converter resposta do Gemini para JSON");
        }
      } else {
        // Tentar extrair JSON diretamente da resposta completa
        try {
          return JSON.parse(responseText);
        } catch (error) {
          console.error("Não foi possível encontrar ou analisar JSON na resposta:", error);
          throw new Error("Resposta do Gemini não contém JSON válido");
        }
      }
    } else {
      throw new Error("Resposta da API do Gemini não contém o conteúdo esperado");
    }
  } catch (error) {
    console.error("Erro ao processar dados com Gemini:", error);
    throw error;
  }
}

// Função auxiliar para registrar logs do sistema
async function addSystemLog(level: "INFO" | "WARN" | "ERROR", message: string, module: string) {
  try {
    await supabase.from('system_logs').insert({
      level,
      message,
      module
    });
  } catch (error) {
    console.error('Erro ao registrar log:', error);
  }
}
