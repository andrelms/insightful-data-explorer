
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface SystemStatusData {
  isConnected: boolean;
  lastSync: string | null;
  notificationCount: number;
  notifications: any[];
  activeConventions: number;
  recentImports: number;
  convTrend: {
    value: number;
    trend: string;
  };
}

export function useSystemStatus() {
  const [status, setStatus] = useState<SystemStatusData>({
    isConnected: true,
    lastSync: null,
    notificationCount: 0,
    notifications: [],
    activeConventions: 0,
    recentImports: 0,
    convTrend: { value: 0.05, trend: 'up' }
  });

  const fetchSystemStatus = async () => {
    try {
      // Verificar conexão com o banco
      const { data: connectionTest, error: connectionError } = await supabase
        .from('configuracoes')
        .select('count(*)')
        .limit(1)
        .single();
        
      const isConnected = !connectionError;
      
      // Buscar última atualização
      const { data: lastUpdate, error: updateError } = await supabase
        .from('convencoes')
        .select('updated_at')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();
        
      let lastSync = null;
      
      if (!updateError && lastUpdate) {
        lastSync = new Date(lastUpdate.updated_at).toLocaleDateString();
      } else {
        // Tentar obter de uploads
        const { data: lastUpload } = await supabase
          .from('uploaded_files')
          .select('uploaded_at')
          .order('uploaded_at', { ascending: false })
          .limit(1)
          .single();
          
        if (lastUpload) {
          lastSync = new Date(lastUpload.uploaded_at).toLocaleDateString();
        } else {
          // Se não encontrar nenhum, usar "0" ao invés de null
          lastSync = "0";
        }
      }
      
      // Buscar notificações (logs de erro)
      const { data: errorLogs, error: logsError } = await supabase
        .from('system_logs')
        .select('count')
        .eq('level', 'ERROR')
        .single();
        
      let notificationCount = 0;
      if (!logsError && errorLogs) {
        notificationCount = parseInt(errorLogs.count) || 0;
      }
      
      // Buscar últimas notificações
      const { data: recentLogs, error: recentLogsError } = await supabase
        .from('system_logs')
        .select('id, timestamp, level, message, module')
        .order('timestamp', { ascending: false })
        .limit(5);
        
      const notifications = !recentLogsError && recentLogs ? recentLogs.map(log => ({
        id: log.id,
        title: `${log.level}: ${log.module || 'Sistema'}`,
        message: log.message,
        date: new Date(log.timestamp).toLocaleString(),
        read: false
      })) : [];

      setStatus({
        isConnected,
        lastSync,
        notificationCount,
        notifications,
        activeConventions: 0, // These could be populated with actual data in a future update
        recentImports: 0,
        convTrend: { value: 0.05, trend: 'up' }
      });
    } catch (error) {
      console.error("Erro ao buscar status do sistema:", error);
      setStatus(prev => ({ ...prev, isConnected: false }));
    }
  };

  const markAllAsRead = async () => {
    try {
      // Atualizar sistema de logs como lidos (aqui seria o código real)
      // Por enquanto apenas atualizamos a interface
      setStatus(prev => ({
        ...prev,
        notificationCount: 0,
        notifications: prev.notifications.map(n => ({...n, read: true}))
      }));
      
      toast({
        title: "Notificações marcadas como lidas",
        description: "Todas as notificações foram marcadas como lidas.",
      });
    } catch (error) {
      console.error("Erro ao marcar notificações como lidas:", error);
    }
  };

  useEffect(() => {
    fetchSystemStatus();
  }, []);

  return {
    ...status,
    markAllAsRead
  };
}
