
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { RefreshCw } from "lucide-react";

interface ConfigItem {
  chave: string;
  valor: string;
  descricao?: string;
}

export function ConfigSection() {
  const [isLoading, setIsLoading] = useState(false);
  const [geminiKey, setGeminiKey] = useState("");
  const [mteUrl, setMteUrl] = useState("");
  const [mteToken, setMteToken] = useState("");
  const [notificationsEmail, setNotificationsEmail] = useState("");
  const [enableAutoImport, setEnableAutoImport] = useState(false);
  const [enableNotifications, setEnableNotifications] = useState(false);
  const [enablePublicSearch, setEnablePublicSearch] = useState(false);

  useEffect(() => {
    const fetchConfigs = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('configuracoes')
          .select('*');

        if (error) throw error;
        
        if (data) {
          // Mapear configurações para os estados
          data.forEach((item: ConfigItem) => {
            switch(item.chave) {
              case 'gemini_api_key':
                setGeminiKey(item.valor || "");
                break;
              case 'mte_api_url':
                setMteUrl(item.valor || "");
                break;
              case 'mte_api_token':
                setMteToken(item.valor || "");
                break;
              case 'notifications_email':
                setNotificationsEmail(item.valor || "");
                break;
              case 'enable_auto_import':
                setEnableAutoImport(item.valor === 'true');
                break;
              case 'enable_notifications':
                setEnableNotifications(item.valor === 'true');
                break;
              case 'enable_public_search':
                setEnablePublicSearch(item.valor === 'true');
                break;
              default:
                // Ignorar outras configurações
                break;
            }
          });
        }
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as configurações.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfigs();
  }, []);

  const upsertConfig = async (chave: string, valor: string, descricao?: string) => {
    try {
      const { data: existingData, error: checkError } = await supabase
        .from('configuracoes')
        .select('id')
        .eq('chave', chave)
        .maybeSingle();

      if (checkError) throw checkError;
      
      if (existingData) {
        // Atualizar configuração existente
        const { error } = await supabase
          .from('configuracoes')
          .update({ valor })
          .eq('chave', chave);
          
        if (error) throw error;
      } else {
        // Inserir nova configuração
        const { error } = await supabase
          .from('configuracoes')
          .insert({ chave, valor, descricao });
          
        if (error) throw error;
      }
      
      return true;
    } catch (error) {
      console.error(`Erro ao salvar configuração ${chave}:`, error);
      return false;
    }
  };

  const handleSaveGeminiKey = async () => {
    setIsLoading(true);
    try {
      const success = await upsertConfig(
        'gemini_api_key', 
        geminiKey, 
        'Chave da API do Google Gemini'
      );
      
      if (success) {
        toast({
          title: "Configuração salva",
          description: "A chave da API do Gemini foi atualizada com sucesso.",
        });
      } else {
        throw new Error("Falha ao salvar configuração");
      }
    } catch (error) {
      console.error('Erro ao salvar chave:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a chave da API.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveMteSettings = async () => {
    setIsLoading(true);
    try {
      const urlSuccess = await upsertConfig(
        'mte_api_url', 
        mteUrl, 
        'URL da API do MTE'
      );
      
      const tokenSuccess = await upsertConfig(
        'mte_api_token', 
        mteToken, 
        'Token de acesso da API do MTE'
      );
      
      if (urlSuccess && tokenSuccess) {
        toast({
          title: "Configurações salvas",
          description: "As configurações de integração com o MTE foram atualizadas com sucesso.",
        });
      } else {
        throw new Error("Falha ao salvar configurações");
      }
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as configurações de integração.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveGeneralSettings = async () => {
    setIsLoading(true);
    try {
      const emailSuccess = await upsertConfig(
        'notifications_email', 
        notificationsEmail, 
        'Email para notificações'
      );
      
      const autoImportSuccess = await upsertConfig(
        'enable_auto_import', 
        enableAutoImport ? 'true' : 'false', 
        'Habilitar importação automática'
      );
      
      const notificationsSuccess = await upsertConfig(
        'enable_notifications', 
        enableNotifications ? 'true' : 'false', 
        'Habilitar notificações por email'
      );
      
      const publicSearchSuccess = await upsertConfig(
        'enable_public_search', 
        enablePublicSearch ? 'true' : 'false', 
        'Habilitar pesquisa pública'
      );
      
      if (emailSuccess && autoImportSuccess && notificationsSuccess && publicSearchSuccess) {
        toast({
          title: "Configurações salvas",
          description: "As configurações gerais foram atualizadas com sucesso.",
        });
      } else {
        throw new Error("Falha ao salvar configurações");
      }
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as configurações gerais.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações do Sistema</CardTitle>
        <CardDescription>
          Gerencie as chaves de API e outras configurações do sistema.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">Geral</TabsTrigger>
            <TabsTrigger value="integration">Integração MTE</TabsTrigger>
            <TabsTrigger value="ai">Inteligência Artificial</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="email-notifications">E-mail para Notificações</Label>
              <Input 
                id="email-notifications" 
                type="email"
                placeholder="seu@email.com" 
                value={notificationsEmail}
                onChange={(e) => setNotificationsEmail(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Este e-mail receberá notificações sobre novas convenções e atualizações
              </p>
            </div>
            
            <div className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enable-notifications">Notificações por email</Label>
                  <p className="text-sm text-muted-foreground">
                    Receba notificações sobre novas convenções.
                  </p>
                </div>
                <Switch 
                  id="enable-notifications" 
                  checked={enableNotifications}
                  onCheckedChange={setEnableNotifications}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enable-auto-import">Importação automática</Label>
                  <p className="text-sm text-muted-foreground">
                    Importar convenções do MTE automaticamente.
                  </p>
                </div>
                <Switch 
                  id="enable-auto-import" 
                  checked={enableAutoImport}
                  onCheckedChange={setEnableAutoImport}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enable-public-search">Pesquisa pública</Label>
                  <p className="text-sm text-muted-foreground">
                    Permitir pesquisa sem autenticação.
                  </p>
                </div>
                <Switch 
                  id="enable-public-search" 
                  checked={enablePublicSearch}
                  onCheckedChange={setEnablePublicSearch}
                />
              </div>
            </div>
            
            <Button 
              onClick={handleSaveGeneralSettings}
              disabled={isLoading}
              className="mt-4"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : "Salvar Configurações"}
            </Button>
          </TabsContent>
          
          <TabsContent value="integration" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="mte-url">URL do Mediador MTE</Label>
              <Input 
                id="mte-url" 
                value={mteUrl}
                onChange={(e) => setMteUrl(e.target.value)}
                placeholder="https://www3.mte.gov.br/sistemas/mediador/consultarins"
              />
            </div>
            
            <div className="space-y-2 mt-4">
              <Label htmlFor="mte-token">Token de API (se necessário)</Label>
              <Input 
                id="mte-token" 
                type="password" 
                placeholder="••••••••"
                value={mteToken}
                onChange={(e) => setMteToken(e.target.value)}
              />
            </div>
            
            <Button 
              onClick={handleSaveMteSettings}
              disabled={isLoading}
              className="mt-4"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : "Salvar Configurações"}
            </Button>
          </TabsContent>
          
          <TabsContent value="ai" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="gemini-key">Chave da API do Google Gemini</Label>
              <div className="flex gap-2">
                <Input
                  id="gemini-key"
                  type="password"
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  placeholder="Insira sua chave da API do Gemini"
                />
                <Button 
                  onClick={handleSaveGeminiKey}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : "Salvar"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Esta chave é usada para alimentar o chat IA e processamento de documentos
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
