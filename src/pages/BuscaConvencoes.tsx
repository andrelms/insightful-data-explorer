
import { useState } from "react";
import { Search, Bot, FileText, Database, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

interface SearchResult {
  id: string;
  query: string;
  provider: string;
  raw_response: any;
  processed_data: any;
  references: string[];
  reasoning: string[];
  created_at: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
}

const BuscaConvencoes = () => {
  const [query, setQuery] = useState("");
  const [provider, setProvider] = useState("gemini");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!query.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, digite uma consulta para buscar",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    try {
      // Simular chamada para API
      const mockResult: SearchResult = {
        id: Date.now().toString(),
        query,
        provider,
        raw_response: {
          model: provider,
          response: "Resposta simulada da API",
          timestamp: new Date().toISOString()
        },
        processed_data: {
          summary: "Dados processados simulados",
          extracted_info: ["Informação 1", "Informação 2"]
        },
        references: [
          "Referência 1: Convenção Coletiva SP 2024",
          "Referência 2: Sindicato XYZ - Tabela Salarial"
        ],
        reasoning: [
          "Identificando sindicatos relevantes",
          "Extraindo informações salariais",
          "Validando dados encontrados"
        ],
        created_at: new Date().toISOString(),
        status: 'completed'
      };

      setSearchResults(prev => [mockResult, ...prev]);
      setSelectedResult(mockResult);
      
      toast({
        title: "Busca concluída",
        description: `Encontradas ${mockResult.references.length} referências`,
      });
    } catch (error) {
      console.error('Erro na busca:', error);
      toast({
        title: "Erro na busca",
        description: "Ocorreu um erro ao realizar a busca",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleProcessResult = async (resultId: string, scope: 'estado' | 'sindicato' | 'todos') => {
    try {
      toast({
        title: "Processamento iniciado",
        description: `Dados sendo processados por ${scope}`,
      });
    } catch (error) {
      console.error('Erro no processamento:', error);
      toast({
        title: "Erro no processamento",
        description: "Ocorreu um erro ao processar os dados",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Busca de Convenções</h1>
        <p className="text-muted-foreground">
          Pesquise informações sobre convenções coletivas usando IA avançada
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Nova Busca
          </CardTitle>
          <CardDescription>
            Digite sua consulta e escolha o provedor de IA para realizar a busca
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Textarea
                placeholder="Ex: Quais são os pisos salariais para analistas de sistemas em SP?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <div className="w-48 space-y-4">
              <Select value={provider} onValueChange={setProvider}>
                <SelectTrigger>
                  <SelectValue placeholder="Provedor de IA" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gemini">Google Gemini</SelectItem>
                  <SelectItem value="perplexity">Perplexity</SelectItem>
                  <SelectItem value="jina">Jina AI</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                onClick={handleSearch} 
                disabled={isSearching || !query.trim()}
                className="w-full"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Buscando...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Buscar
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Resultado da Busca
              <Badge variant="outline">{selectedResult.provider}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="processed" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="processed">Processado</TabsTrigger>
                <TabsTrigger value="reasoning">Raciocínio</TabsTrigger>
                <TabsTrigger value="references">Referências</TabsTrigger>
                <TabsTrigger value="raw">Dados Brutos</TabsTrigger>
              </TabsList>
              
              <TabsContent value="processed" className="space-y-4">
                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Dados Processados</h3>
                  <pre className="text-sm overflow-auto max-h-96">
                    {JSON.stringify(selectedResult.processed_data, null, 2)}
                  </pre>
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={() => handleProcessResult(selectedResult.id, 'estado')}>
                    <Database className="mr-2 h-4 w-4" />
                    Processar por Estado
                  </Button>
                  <Button onClick={() => handleProcessResult(selectedResult.id, 'sindicato')}>
                    <Database className="mr-2 h-4 w-4" />
                    Processar por Sindicato
                  </Button>
                  <Button onClick={() => handleProcessResult(selectedResult.id, 'todos')}>
                    <Database className="mr-2 h-4 w-4" />
                    Processar Todos
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="reasoning">
                <div className="space-y-2">
                  {selectedResult.reasoning.map((step, index) => (
                    <div key={index} className="bg-blue-50 border-l-4 border-blue-400 p-3">
                      <div className="font-medium text-sm">Passo {index + 1}</div>
                      <div className="text-sm">{step}</div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="references">
                <div className="space-y-2">
                  {selectedResult.references.map((ref, index) => (
                    <div key={index} className="bg-green-50 border-l-4 border-green-400 p-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm">{ref}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="raw">
                <div className="bg-gray-50 rounded-lg p-4">
                  <pre className="text-xs overflow-auto max-h-96">
                    {JSON.stringify(selectedResult.raw_response, null, 2)}
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {searchResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Buscas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {searchResults.map((result) => (
                <div
                  key={result.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedResult?.id === result.id
                      ? 'bg-primary/10 border-primary'
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedResult(result)}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-sm truncate">{result.query}</div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {result.provider}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(result.created_at).toLocaleString('pt-BR')}
                      </span>
                    </div>
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
