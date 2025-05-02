
import { addSystemLog } from './logger';

// Function to process blocks of data using Gemini 2.5
export async function processDataBlockWithGemini(dataBlock: any[], apiKey: string): Promise<any[]> {
  try {
    // Prepare the system prompt for Gemini
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
    
    console.log("Enviando dados para processamento com Gemini...");
    
    // Prepare the payload for the API
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
    
    // Call the Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    console.log("Resposta da API Gemini:", response.status);
    
    if (!response.ok) {
      throw new Error(`Erro na API do Gemini: ${response.status} ${response.statusText}`);
    }
    
    const responseData = await response.json();
    console.log("Dados recebidos do Gemini");
    
    // Extract and process the response
    if (responseData.candidates && responseData.candidates[0]?.content?.parts?.[0]?.text) {
      const responseText = responseData.candidates[0].content.parts[0].text;
      
      // Try to extract the JSON from the response
      const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || 
                        responseText.match(/```\n([\s\S]*?)\n```/) ||
                        responseText.match(/\[([\s\S]*?)\]/);
      
      if (jsonMatch && jsonMatch[1]) {
        try {
          let jsonStr = jsonMatch[1];
          // If it's a simple array without brackets, add brackets
          if (!jsonStr.trim().startsWith('[')) {
            jsonStr = '[' + jsonStr + ']';
          }
          console.log("Processando JSON da resposta do Gemini");
          return JSON.parse(jsonStr);
        } catch (error) {
          console.error("Erro ao fazer parse da resposta JSON:", error);
          throw new Error("Falha ao converter resposta do Gemini para JSON");
        }
      } else {
        // Try to extract JSON directly from the full response
        try {
          console.log("Tentando processar resposta completa como JSON");
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
