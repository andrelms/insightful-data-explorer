
import { useState, useEffect } from "react";
import { Key, Save, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ApiKey {
  chave: string;
  valor: string;
  descricao: string;
}

export function ConfiguracaoChaves() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const defaultKeys = [
    {
      chave: 'GEMINI_API_KEY',
      valor: '',
      descricao: 'Chave da API do Google Gemini para busca e processamento'
    },
    {
      chave: 'PERPLEXITY_API_KEY',
      valor: '',
      descricao: 'Chave da API do Perplexity para pesquisa avançada'
    },
    {
      chave: 'JINA_API_KEY',
      valor: '',
      descricao: 'Chave da API do Jina AI para análise de documentos'
    }
  ];

  useEffect(() => {
    loadApiKeys();
  }, []);

  const loadApiKeys = async () => {
    try {
      const { data, error } = await supabase
        .from('configuracoes')
        .select('chave, valor, descricao')
        .in('chave', defaultKeys.map(k => k.chave));

      if (error) throw error;

      // Merge with defaults
      const keysMap = new Map(data?.map(item => [item.chave, item]) || []);
      const mergedKeys = defaultKeys.map(defaultKey => {
        const existing = keysMap.get(defaultKey.chave);
        return existing || defaultKey;
      });

      setApiKeys(mergedKeys);
    } catch (error) {
      console.error('Erro ao carregar chaves:', error);
      setApiKeys(defaultKeys);
    } finally {
      setLoading(false);
    }
  };

  const saveApiKey = async (chave: string, valor: string) => {
    setSaving(chave);
    try {
      const { error } = await supabase
        .from('configuracoes')
        .upsert({
          chave,
          valor,
          descricao: defaultKeys.find(k => k.chave === chave)?.descricao || ''
        });

      if (error) throw error;

      setApiKeys(prev => 
        prev.map(key => 
          key.chave === chave ? { ...key, valor } : key
        )
      );

      toast({
        title: "Chave salva",
        description: `A chave ${chave} foi salva com sucesso`,
      });
    } catch (error) {
      console.error('Erro ao salvar chave:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar a chave da API",
        variant: "destructive",
      });
    } finally {
      setSaving(null);
    }
  };

  const toggleKeyVisibility = (chave: string) => {
    setShowKeys(prev => ({
      ...prev,
      [chave]: !prev[chave]
    }));
  };

  const updateKeyValue = (chave: string, valor: string) => {
    setApiKeys(prev => 
      prev.map(key => 
        key.chave === chave ? { ...key, valor } : key
      )
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Configuração de Chaves API</h2>
        <p className="text-muted-foreground">
          Configure as chaves de API para integração com serviços de IA
        </p>
      </div>

      <div className="grid gap-6">
        {apiKeys.map((apiKey) => (
          <Card key={apiKey.chave}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                {apiKey.chave}
              </CardTitle>
              <CardDescription>
                {apiKey.descricao}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={apiKey.chave}>Chave da API</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      id={apiKey.chave}
                      type={showKeys[apiKey.chave] ? "text" : "password"}
                      value={apiKey.valor}
                      onChange={(e) => updateKeyValue(apiKey.chave, e.target.value)}
                      placeholder="Cole sua chave da API aqui..."
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => toggleKeyVisibility(apiKey.chave)}
                    >
                      {showKeys[apiKey.chave] ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <Button
                    onClick={() => saveApiKey(apiKey.chave, apiKey.valor)}
                    disabled={saving === apiKey.chave || !apiKey.valor.trim()}
                  >
                    {saving === apiKey.chave ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
