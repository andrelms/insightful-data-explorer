
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { DatabaseManagement } from "@/components/admin/DatabaseManagement";
import { ImportSection } from "@/components/admin/ImportSection";

const Configuracoes = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailNotificacoes, setEmailNotificacoes] = useState("");
  const [apiKey, setApiKey] = useState("");

  const handleSaveGeneralSettings = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Configurações salvas",
        description: "As configurações gerais foram salvas com sucesso.",
      });
    }, 1000);
  };

  const handleSaveApiSettings = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Configurações de API salvas",
        description: "As configurações de API foram salvas com sucesso.",
      });
    }, 1000);
  };

  const handleSaveAISettings = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Configurações de IA salvas",
        description: "As configurações de IA foram salvas com sucesso.",
      });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Administração & Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações do sistema, importe dados e administre a base de dados.
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="api">Integração MTE</TabsTrigger>
          <TabsTrigger value="ai">Modelos de IA</TabsTrigger>
          <TabsTrigger value="database">Gerenciamento de Dados</TabsTrigger>
        </TabsList>

        {/* Configurações Gerais */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>
                Configurações básicas do sistema.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="site-name">Nome do Sistema</Label>
                <Input id="site-name" defaultValue="Sistema de Convenções Coletivas" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="site-description">Descrição</Label>
                <Textarea 
                  id="site-description" 
                  defaultValue="Consulta de convenções coletivas de trabalho" 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email-notifications">E-mail para Notificações</Label>
                <Input 
                  id="email-notifications" 
                  type="email"
                  placeholder="seu@email.com" 
                  value={emailNotificacoes}
                  onChange={(e) => setEmailNotificacoes(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Este e-mail receberá notificações sobre novas convenções e atualizações
                </p>
              </div>

              <Separator />
              
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Opções do Sistema</h4>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications">Notificações por email</Label>
                    <p className="text-sm text-muted-foreground">
                      Receba notificações sobre novas convenções.
                    </p>
                  </div>
                  <Switch id="notifications" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-import">Importação automática</Label>
                    <p className="text-sm text-muted-foreground">
                      Importar convenções do MTE automaticamente.
                    </p>
                  </div>
                  <Switch id="auto-import" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="public-search">Pesquisa pública</Label>
                    <p className="text-sm text-muted-foreground">
                      Permitir pesquisa sem autenticação.
                    </p>
                  </div>
                  <Switch id="public-search" defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSaveGeneralSettings}
                disabled={isLoading}
              >
                {isLoading ? "Salvando..." : "Salvar Configurações"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Configurações da API */}
        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Integração com MTE</CardTitle>
              <CardDescription>
                Configuração da integração com o sistema Mediador do MTE.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="api-url">URL do Mediador MTE</Label>
                <Input 
                  id="api-url" 
                  defaultValue="https://www3.mte.gov.br/sistemas/mediador/consultarins"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="api-token">Token de API (se necessário)</Label>
                <Input id="api-token" type="password" placeholder="••••••••" />
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Configurações de Requisição</h4>
                
                <div className="space-y-2">
                  <Label htmlFor="request-timeout">Timeout (segundos)</Label>
                  <Input id="request-timeout" type="number" defaultValue={30} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="request-retries">Tentativas</Label>
                  <Input id="request-retries" type="number" defaultValue={3} />
                </div>
                
                <div className="space-y-2">
                  <Label>Parâmetros Padrão de Busca</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="search-type">Tipo de Instrumento</Label>
                      <select 
                        id="search-type"
                        className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="todos">Todos os Tipos</option>
                        <option value="convencao">Convenção Coletiva</option>
                        <option value="acordo">Acordo Coletivo</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="search-vigencia">Vigência</Label>
                      <select 
                        id="search-vigencia"
                        className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="vigentes">Apenas Vigentes</option>
                        <option value="todos">Todas</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveApiSettings}>Salvar Configurações da API</Button>
            </CardFooter>
          </Card>
          
          <ImportSection />
        </TabsContent>

        {/* Configurações de IA */}
        <TabsContent value="ai" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de IA</CardTitle>
              <CardDescription>
                Configure os modelos de IA utilizados no sistema.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ai-provider">Provedor de IA Principal</Label>
                    <select 
                      id="ai-provider"
                      className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="gemini">Google Gemini 2.5 Pro</option>
                      <option value="anthropic">Anthropic Claude 3 Sonnet</option>
                      <option value="openai">OpenAI GPT-4o</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="api-key">Chave da API</Label>
                    <Input 
                      id="api-key" 
                      type="password" 
                      placeholder="••••••••" 
                      value={apiKey}
                      onChange={e => setApiKey(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="p-4 border rounded-md bg-muted/30">
                  <h4 className="text-sm font-medium mb-2">API Keys para Modelos Específicos</h4>
                  <p className="text-xs text-muted-foreground mb-3">
                    Configure chaves de API adicionais para tarefas específicas
                  </p>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label htmlFor="rag-api-key" className="text-xs">Chave para RAG (Recuperação)</Label>
                        <Input id="rag-api-key" type="password" placeholder="••••••••" />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="preprocessing-api-key" className="text-xs">Chave para Pré-processamento</Label>
                        <Input id="preprocessing-api-key" type="password" placeholder="••••••••" />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="chat-api-key" className="text-xs">Chave para Chat com Gráficos</Label>
                        <Input id="chat-api-key" type="password" placeholder="••••••••" />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="reasoning-api-key" className="text-xs">Chave para Análises Avançadas</Label>
                        <Input id="reasoning-api-key" type="password" placeholder="••••••••" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Configurações de Modelos</h4>
                  
                  <div className="space-y-2">
                    <Label htmlFor="rag-model">Modelo para Recuperação (RAG)</Label>
                    <select 
                      id="rag-model"
                      className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="text-embedding-3-large">OpenAI text-embedding-3-large</option>
                      <option value="text-embedding-3-small">OpenAI text-embedding-3-small</option>
                      <option value="gemini-embedding">Google Gemini Embeddings</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="chat-model">Modelo para Chat IA</Label>
                    <select 
                      id="chat-model"
                      className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="claude-3-sonnet">Anthropic Claude 3 Sonnet</option>
                      <option value="gpt4o">OpenAI GPT-4o</option>
                      <option value="gemini-pro">Google Gemini 2.5 Pro</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="reasoning-model">Modelo para Análise e Raciocínio</Label>
                    <select 
                      id="reasoning-model"
                      className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="gemini-pro">Google Gemini Pro</option>
                      <option value="claude-3-opus">Anthropic Claude 3 Opus</option>
                      <option value="deepseek-coder">DeepSeek Coder</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Opções de RAG</h4>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enable-rag">Habilitar RAG</Label>
                      <p className="text-sm text-muted-foreground">
                        Usar recuperação aumentada para melhorar respostas.
                      </p>
                    </div>
                    <Switch id="enable-rag" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enable-charts">Gerar Gráficos e Tabelas</Label>
                      <p className="text-sm text-muted-foreground">
                        Permitir que o Chat IA gere visualizações de dados.
                      </p>
                    </div>
                    <Switch id="enable-charts" defaultChecked />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="vector-db">Banco de Dados Vetorial</Label>
                    <Input 
                      id="vector-db" 
                      defaultValue="Chroma" 
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveAISettings}>Salvar Configurações de IA</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Gerenciamento de Banco de Dados */}
        <TabsContent value="database" className="space-y-4">
          <DatabaseManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Configuracoes;
