
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface ConfigItem {
  chave: string;
  valor: string;
  descricao?: string;
}

export function useConfigSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [geminiKey, setGeminiKey] = useState("");
  const [mteUrl, setMteUrl] = useState("");
  const [mteToken, setMteToken] = useState("");
  const [notificationsEmail, setNotificationsEmail] = useState("");
  const [enableAutoImport, setEnableAutoImport] = useState(false);
  const [enableNotifications, setEnableNotifications] = useState(false);
  const [enablePublicSearch, setEnablePublicSearch] = useState(false);

  useEffect(() => {
    fetchConfigs();
  }, []);

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

  return {
    isLoading,
    geminiKey,
    mteUrl,
    mteToken,
    notificationsEmail,
    enableAutoImport,
    enableNotifications,
    enablePublicSearch,
    setGeminiKey,
    setMteUrl,
    setMteToken,
    setNotificationsEmail,
    setEnableAutoImport,
    setEnableNotifications,
    setEnablePublicSearch,
    handleSaveGeminiKey,
    handleSaveMteSettings,
    handleSaveGeneralSettings
  };
}
