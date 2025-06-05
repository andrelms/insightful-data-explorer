
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SearchResult, Provider, Scope } from "@/types/busca-convencoes";
import { convertDatabaseResultToSearchResult } from "@/utils/busca-convencoes";

export const useBuscaConvencoes = () => {
  const [searching, setSearching] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [currentResult, setCurrentResult] = useState<SearchResult | null>(null);
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const { toast } = useToast();

  useEffect(() => {
    loadApiKeys();
    loadSearchHistory();
  }, []);

  const loadApiKeys = async () => {
    try {
      const { data, error } = await supabase
        .from('configuracoes')
        .select('chave, valor')
        .in('chave', ['GEMINI_API_KEY', 'PERPLEXITY_API_KEY', 'JINA_API_KEY']);

      if (error) throw error;

      const keys = data?.reduce((acc, item) => {
        acc[item.chave] = item.valor || '';
        return acc;
      }, {} as Record<string, string>) || {};

      setApiKeys(keys);
    } catch (error) {
      console.error('Erro ao carregar chaves:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar configurações das APIs",
        variant: "destructive",
      });
    }
  };

  const loadSearchHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('search_results')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      
      const convertedResults = data?.map(convertDatabaseResultToSearchResult) || [];
      setSearchResults(convertedResults);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    }
  };

  const performSearch = async (query: string, provider: Provider, scope: Scope) => {
    if (!query.trim()) {
      toast({
        title: "Erro",
        description: "Digite uma consulta para buscar",
        variant: "destructive",
      });
      return;
    }

    const apiKey = apiKeys[`${provider.toUpperCase()}_API_KEY`];
    if (!apiKey) {
      toast({
        title: "Erro",
        description: `Chave da API ${provider} não configurada. Acesse as configurações para adicionar.`,
        variant: "destructive",
      });
      return;
    }

    setSearching(true);

    try {
      // Simular resposta da API (substituir pela chamada real)
      const mockResponse = {
        resultado: `Resultados da busca para: "${query}"`,
        fontes: [
          "https://www.sindpd-sp.org.br/convencoes",
          "https://www.fenainfo.org.br/documentos",
          "Portal MTE - Convenções Coletivas"
        ],
        raciocinio: [
          "Analisando consulta sobre convenções coletivas",
          "Buscando dados de sindicatos relevantes",
          "Compilando informações por hierarquia: sindicatos > convenções > cargos",
          "Filtrando resultados por relevância"
        ]
      };

      // Salvar resultado no banco
      const { data: newResult, error } = await supabase
        .from('search_results')
        .insert({
          query,
          provider,
          raw_response: mockResponse,
          referencia_fontes: mockResponse.fontes,
          etapas_raciocinio: mockResponse.raciocinio,
          status: 'completed'
        })
        .select()
        .single();

      if (error) throw error;

      const convertedResult = convertDatabaseResultToSearchResult(newResult);
      setCurrentResult(convertedResult);
      setSearchResults(prev => [convertedResult, ...prev]);

      toast({
        title: "Busca concluída",
        description: "Resultados obtidos com sucesso",
      });
    } catch (error) {
      console.error('Erro na busca:', error);
      toast({
        title: "Erro",
        description: "Erro ao realizar busca",
        variant: "destructive",
      });
    } finally {
      setSearching(false);
    }
  };

  const startBatchProcessing = async (resultId: string, scope: Scope) => {
    setProcessing(true);

    try {
      const { data, error } = await supabase
        .from('batch_processing')
        .insert({
          search_result_id: resultId,
          scope,
          status: 'processing',
          total_count: 100 // Exemplo
        })
        .select()
        .single();

      if (error) throw error;

      // Simular processamento em lotes
      toast({
        title: "Processamento iniciado",
        description: `Processando dados para escopo: ${scope}`,
      });

      // Aqui viria a lógica real de processamento
      setTimeout(() => {
        setProcessing(false);
        toast({
          title: "Processamento concluído",
          description: "Dados salvos no banco Supabase",
        });
      }, 3000);

    } catch (error) {
      console.error('Erro no processamento:', error);
      setProcessing(false);
      toast({
        title: "Erro",
        description: "Erro ao iniciar processamento",
        variant: "destructive",
      });
    }
  };

  return {
    searching,
    processing,
    searchResults,
    currentResult,
    setCurrentResult,
    performSearch,
    startBatchProcessing
  };
};
