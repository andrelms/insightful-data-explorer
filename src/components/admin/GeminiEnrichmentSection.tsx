
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Brain, Plus, X, RefreshCw, Database } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface GeminiKey {
  id: string;
  key: string;
  status: 'active' | 'limit_reached' | 'error';
  usageCount: number;
}

export function GeminiEnrichmentSection() {
  const [geminiKeys, setGeminiKeys] = useState<GeminiKey[]>([]);
  const [newKey, setNewKey] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const { toast } = useToast();

  const addGeminiKey = () => {
    if (!newKey.trim()) return;
    
    const newGeminiKey: GeminiKey = {
      id: crypto.randomUUID(),
      key: newKey.trim(),
      status: 'active',
      usageCount: 0
    };
    
    setGeminiKeys(prev => [...prev, newGeminiKey]);
    setNewKey("");
    
    toast({
      title: "Chave adicionada",
      description: "Nova chave Gemini adicionada com sucesso.",
    });
  };

  const removeKey = (keyId: string) => {
    setGeminiKeys(prev => prev.filter(k => k.id !== keyId));
  };

  const startEnrichment = async () => {
    if (geminiKeys.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione pelo menos uma chave do Gemini antes de iniciar.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProcessingProgress(0);

    try {
      // Buscar sindicatos que precisam de enriquecimento
      const { data: sindicatos, error } = await supabase
        .from('sindicatos')
        .select(`
          id, nome, cnpj, site, data_base, estado,
          convenios (
            id,
            cargos (
              id, cargo, carga_horaria
            )
          )
        `)
        .limit(10); // Limitar para teste

      if (error) throw error;

      if (!sindicatos || sindicatos.length === 0) {
        toast({
          title: "Nenhum dado encontrado",
          description: "Não há sindicatos para processar.",
        });
        setIsProcessing(false);
        return;
      }

      // Processar cada sindicato
      let currentKeyIndex = 0;
      const totalItems = sindicatos.length;

      for (let i = 0; i < sindicatos.length; i++) {
        const sindicato = sindicatos[i];
        
        try {
          // Usar chave alternada
          const currentKey = geminiKeys[currentKeyIndex];
          
          // Preparar prompt para o Gemini
          const prompt = `
            Você é um especialista em legislação trabalhista brasileira e em análise de Convenções Coletivas de Trabalho (CCTs).
            Sua tarefa é buscar as CCTs mais recentes para sindicatos e empresas privadas, extrair informações chave e formatá-las em um JSON estruturado.

            Dados de Entrada:
            SINDICATO: ${sindicato.nome}
            CNPJ: ${sindicato.cnpj || 'NaN'}
            SITE: ${sindicato.site || 'NaN'}
            DATA BASE: ${sindicato.data_base || 'NaN'}
            ESTADO: ${sindicato.estado || 'UNKNOWN'}

            Busque informações atualizadas sobre este sindicato e retorne um JSON com:
            - Informações atualizadas do sindicato
            - Pisos salariais atuais
            - Benefícios oferecidos
            - Particularidades da convenção coletiva
            - Jornadas de trabalho
            - Valores de hora extra

            Retorne apenas o JSON estruturado conforme o esquema do banco de dados.
          `;

          // Chamar API do Gemini
          const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${currentKey.key}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [{
                role: "user",
                parts: [{ text: prompt }]
              }],
              generationConfig: {
                temperature: 0.1,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 8192,
              }
            }),
          });

          if (response.status === 429) {
            // Limite atingido, marcar chave e tentar próxima
            setGeminiKeys(prev => prev.map(k => 
              k.id === currentKey.id ? { ...k, status: 'limit_reached' } : k
            ));
            
            currentKeyIndex = (currentKeyIndex + 1) % geminiKeys.length;
            continue;
          }

          if (!response.ok) {
            throw new Error(`Erro na API: ${response.status}`);
          }

          const responseData = await response.json();
          
          // Extrair JSON da resposta
          if (responseData.candidates && responseData.candidates[0]?.content?.parts?.[0]?.text) {
            const responseText = responseData.candidates[0].content.parts[0].text;
            
            try {
              // Tentar extrair e parsear JSON
              const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || 
                              responseText.match(/\{[\s\S]*\}/);
              
              if (jsonMatch) {
                const extractedData = JSON.parse(jsonMatch[1] || jsonMatch[0]);
                
                // Salvar dados extraídos no banco
                if (extractedData.beneficios_gerais && extractedData.beneficios_gerais.length > 0) {
                  await supabase
                    .from('beneficios_gerais')
                    .insert(extractedData.beneficios_gerais);
                }
                
                if (extractedData.particularidades && extractedData.particularidades.length > 0) {
                  await supabase
                    .from('particularidades')
                    .insert(extractedData.particularidades);
                }
                
                // Atualizar contadores
                setGeminiKeys(prev => prev.map(k => 
                  k.id === currentKey.id ? { ...k, usageCount: k.usageCount + 1 } : k
                ));
              }
            } catch (parseError) {
              console.error("Erro ao parsear JSON:", parseError);
            }
          }

          // Alternar para próxima chave
          currentKeyIndex = (currentKeyIndex + 1) % geminiKeys.length;
          
        } catch (error) {
          console.error(`Erro ao processar ${sindicato.nome}:`, error);
        }

        // Atualizar progresso
        setProcessingProgress(Math.round(((i + 1) / totalItems) * 100));
        
        // Delay entre requisições
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      toast({
        title: "Enriquecimento concluído",
        description: `Processados ${sindicatos.length} sindicatos com sucesso.`,
      });
      
    } catch (error) {
      console.error("Erro no enriquecimento:", error);
      toast({
        title: "Erro no processamento",
        description: "Ocorreu um erro durante o enriquecimento dos dados.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setProcessingProgress(0);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Enriquecimento de Dados com Gemini 2.5 Pro Flash
        </CardTitle>
        <CardDescription>
          Configure múltiplas chaves do Gemini para busca dinâmica e enriquecimento dos dados do banco.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Gerenciamento de Chaves */}
        <div className="space-y-4">
          <Label>Chaves do Gemini</Label>
          
          <div className="flex gap-2">
            <Input
              type="password"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              placeholder="Insira uma chave da API do Gemini"
              onKeyPress={(e) => e.key === 'Enter' && addGeminiKey()}
            />
            <Button onClick={addGeminiKey} disabled={!newKey.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Lista de chaves */}
          <div className="space-y-2">
            {geminiKeys.map((keyItem) => (
              <div key={keyItem.id} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm">
                    {keyItem.key.substring(0, 8)}...{keyItem.key.substring(keyItem.key.length - 4)}
                  </span>
                  <Badge variant={
                    keyItem.status === 'active' ? 'default' : 
                    keyItem.status === 'limit_reached' ? 'secondary' : 'destructive'
                  }>
                    {keyItem.status === 'active' ? 'Ativa' : 
                     keyItem.status === 'limit_reached' ? 'Limite Atingido' : 'Erro'}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Usos: {keyItem.usageCount}
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => removeKey(keyItem.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Botão de Início */}
        <div className="space-y-4">
          <Button 
            onClick={startEnrichment} 
            disabled={isProcessing || geminiKeys.length === 0}
            className="w-full"
            size="lg"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Enriquecendo dados... {processingProgress}%
              </>
            ) : (
              <>
                <Database className="h-4 w-4 mr-2" />
                Iniciar Enriquecimento de Dados
              </>
            )}
          </Button>

          {isProcessing && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${processingProgress}%` }}
              />
            </div>
          )}
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
          <div className="flex items-start gap-2">
            <Brain className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Como funciona o enriquecimento
              </h3>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                O sistema utiliza múltiplas chaves do Gemini 2.5 Pro Flash de forma intercalada para buscar 
                informações atualizadas sobre convenções coletivas. Quando uma chave atinge o limite, 
                automaticamente alterna para a próxima disponível.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
