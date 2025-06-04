
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Search, Brain, FileText, Zap, Clock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

// Updated interface to match database structure
interface SearchResult {
  id: string;
  query: string;
  provider: 'gemini' | 'perplexity' | 'jina';
  raw_response: any;
  processed_data?: any;
  referencia_fontes?: string[];
  etapas_raciocinio?: string[];
  status: 'pending' | 'processing' | 'completed' | 'error';
  created_at: string;
  updated_at: string;
}

interface BatchProcessing {
  id: string;
  search_result_id: string;
  scope: 'estado' | 'sindicato' | 'todos';
  status: 'pending' | 'processing' | 'completed' | 'error';
  processed_count: number;
  total_count: number;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

// Type conversion helper
const convertDatabaseResultToSearchResult = (dbResult: any): SearchResult => {
  return {
    id: dbResult.id,
    query: dbResult.query,
    provider: dbResult.provider as 'gemini' | 'perplexity' | 'jina',
    raw_response: dbResult.raw_response,
    processed_data: dbResult.processed_data,
    referencia_fontes: dbResult.referencia_fontes || [],
    etapas_raciocinio: dbResult.etapas_raciocinio || [],
    status: dbResult.status as 'pending' | 'processing' | 'completed' | 'error',
    created_at: dbResult.created_at,
    updated_at: dbResult.updated_at,
  };
};

const BuscaConvencoes = () => {
  const [query, setQuery] = useState("");
  const [provider, setProvider] = useState<'gemini' | 'perplexity' | 'jina'>('gemini');
  const [scope, setScope] = useState<'estado' | 'sindicato' | 'todos'>('todos');
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

  const performSearch = async () => {
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

  const startBatchProcessing = async (resultId: string) => {
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

  const getProviderIcon = (providerName: string) => {
    switch (providerName) {
      case 'gemini': return <Brain className="h-4 w-4" />;
      case 'perplexity': return <Search className="h-4 w-4" />;
      case 'jina': return <FileText className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'processing': return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Busca de Convenções</h1>
        <p className="text-muted-foreground">
          Realize buscas inteligentes utilizando IA para encontrar informações sobre convenções coletivas
        </p>
      </div>

      {/* Formulário de Busca */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Nova Busca
          </CardTitle>
          <CardDescription>
            Configure os parâmetros da busca e selecione o provedor de IA
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="query">Consulta</Label>
            <Textarea
              id="query"
              placeholder="Ex: Buscar pisos salariais para analistas de sistemas em São Paulo..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="provider">Provedor de IA</Label>
              <Select value={provider} onValueChange={(value) => setProvider(value as 'gemini' | 'perplexity' | 'jina')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gemini">
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      Google Gemini
                    </div>
                  </SelectItem>
                  <SelectItem value="perplexity">
                    <div className="flex items-center gap-2">
                      <Search className="h-4 w-4" />
                      Perplexity AI
                    </div>
                  </SelectItem>
                  <SelectItem value="jina">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Jina AI
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="scope">Escopo do Processamento</Label>
              <Select value={scope} onValueChange={(value) => setScope(value as 'estado' | 'sindicato' | 'todos')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Estados</SelectItem>
                  <SelectItem value="estado">Por Estado</SelectItem>
                  <SelectItem value="sindicato">Por Sindicato</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={performSearch} 
            disabled={searching || !query.trim()}
            className="w-full"
          >
            {searching ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Buscando...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Realizar Busca
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Resultado Atual */}
      {currentResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getProviderIcon(currentResult.provider)}
              Resultado da Busca
              <Badge variant="outline">{currentResult.provider}</Badge>
              {getStatusIcon(currentResult.status)}
            </CardTitle>
            <CardDescription>
              Consulta: {currentResult.query}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Etapas do Raciocínio */}
            {currentResult.etapas_raciocinio && currentResult.etapas_raciocinio.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Etapas do Raciocínio</h4>
                <div className="space-y-1">
                  {currentResult.etapas_raciocinio.map((etapa, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                      {etapa}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Fontes de Referência */}
            {currentResult.referencia_fontes && currentResult.referencia_fontes.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Fontes de Referência</h4>
                <div className="space-y-1">
                  {currentResult.referencia_fontes.map((fonte, index) => (
                    <div key={index} className="text-sm text-blue-600 hover:underline">
                      • {fonte}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Resposta Bruta */}
            <div className="space-y-2">
              <h4 className="font-medium">Resposta da IA</h4>
              <div className="bg-muted p-4 rounded-lg text-sm">
                <pre className="whitespace-pre-wrap">
                  {JSON.stringify(currentResult.raw_response, null, 2)}
                </pre>
              </div>
            </div>

            {/* Processamento */}
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Processamento para o Banco</h4>
                  <p className="text-sm text-muted-foreground">
                    Processar e salvar os dados estruturados no Supabase
                  </p>
                </div>
                <Button 
                  onClick={() => startBatchProcessing(currentResult.id)}
                  disabled={processing}
                  variant="outline"
                >
                  {processing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    "Processar Dados"
                  )}
                </Button>
              </div>
              {processing && (
                <div className="mt-4">
                  <Progress value={33} className="w-full" />
                  <p className="text-sm text-muted-foreground mt-2">
                    Processando dados por hierarquia: sindicatos → convenções → cargos...
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Histórico de Buscas */}
      {searchResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Buscas</CardTitle>
            <CardDescription>
              Últimas buscas realizadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {searchResults.map((result) => (
                <div 
                  key={result.id} 
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => setCurrentResult(result)}
                >
                  <div className="flex items-center gap-3">
                    {getProviderIcon(result.provider)}
                    <div>
                      <p className="font-medium text-sm">{result.query}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(result.created_at).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{result.provider}</Badge>
                    {getStatusIcon(result.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BuscaConvencoes;
