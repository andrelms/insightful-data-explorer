
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";

const Configuracoes = () => {
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações do sistema.
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="ai">Inteligência Artificial</TabsTrigger>
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
                <Label htmlFor="site-name">Nome do Site</Label>
                <Input id="site-name" defaultValue="Sistema de Convenções Coletivas" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="site-description">Descrição do Site</Label>
                <Input 
                  id="site-description" 
                  defaultValue="Consulta de convenções coletivas de trabalho" 
                />
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
              <CardTitle>Configurações da API</CardTitle>
              <CardDescription>
                Gerenciamento das configurações de API e integrações.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="api-url">URL do MTE</Label>
                <Input 
                  id="api-url" 
                  defaultValue="https://www.gov.br/mte/pt-br/sistemas/mediador/ConsultarInstColetivo"
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
              </div>
            </CardContent>
            <CardFooter>
              <Button>Salvar Configurações da API</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Configurações de IA */}
        <TabsContent value="ai" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de IA</CardTitle>
              <CardDescription>
                Configure as integrações com serviços de IA para o chatbot.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="ai-provider">Provedor de IA</Label>
                <Input 
                  id="ai-provider" 
                  defaultValue="Google Gemini 2.5 Pro" 
                  readOnly 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="api-key">Chave da API do Gemini</Label>
                <Input 
                  id="api-key" 
                  type="password" 
                  placeholder="••••••••" 
                />
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Configurações de RAG</h4>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enable-rag">Habilitar RAG</Label>
                    <p className="text-sm text-muted-foreground">
                      Usar recuperação aumentada para melhorar respostas.
                    </p>
                  </div>
                  <Switch id="enable-rag" defaultChecked />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="embedding-model">Modelo de Embedding</Label>
                  <Input 
                    id="embedding-model" 
                    defaultValue="text-embedding-3-large" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="vector-db">Banco de Dados Vetorial</Label>
                  <Input 
                    id="vector-db" 
                    defaultValue="Chroma" 
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Salvar Configurações de IA</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Configuracoes;
