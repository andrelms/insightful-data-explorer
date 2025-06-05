
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Brain, FileText, Loader2 } from "lucide-react";
import { Provider, Scope } from "@/types/busca-convencoes";

interface SearchFormProps {
  onSearch: (query: string, provider: Provider, scope: Scope) => void;
  searching: boolean;
}

export const SearchForm = ({ onSearch, searching }: SearchFormProps) => {
  const [query, setQuery] = useState("");
  const [provider, setProvider] = useState<Provider>('gemini');
  const [scope, setScope] = useState<Scope>('todos');

  const handleSubmit = () => {
    if (!query.trim()) return;
    onSearch(query, provider, scope);
  };

  return (
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
            <Select value={provider} onValueChange={(value) => setProvider(value as Provider)}>
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
            <Select value={scope} onValueChange={(value) => setScope(value as Scope)}>
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
          onClick={handleSubmit} 
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
  );
};
