
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  date?: string; // Making date optional to match components
}

export interface SystemStatusData {
  isConnected: boolean;
  lastSync: string | null;
  notificationCount: number; // Changed to number
  notifications: Notification[];
  activeConventions: number;
  recentImports: number;
  convTrend: number; // Changed to number
  markAllAsRead: () => void;
}

export function useSystemStatus(): SystemStatusData {
  const [isConnected, setIsConnected] = useState(true);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeConventions, setActiveConventions] = useState<number>(0);
  const [recentImports, setRecentImports] = useState<number>(0);
  const [convTrend, setConvTrend] = useState<number>(0);

  useEffect(() => {
    const checkSystemStatus = async () => {
      try {
        // Verificar conexão com o Supabase
        const { error } = await supabase.from('configuracoes').select('count').limit(1);
        
        if (error) {
          console.error("Erro ao verificar status do sistema:", error);
          setIsConnected(false);
        } else {
          setIsConnected(true);
        }

        // Buscar informações reais do banco de dados
        const fetchData = async () => {
          // Convenções ativas
          const { data: convencoesData, error: convError } = await supabase
            .from('convencoes')
            .select('count')
            .gte('vigencia_fim', new Date().toISOString());
          
          if (!convError && convencoesData) {
            setActiveConventions(convencoesData.length);
          }

          // Importações recentes
          const { data: importacoesData, error: impError } = await supabase
            .from('historico_importacao')
            .select('*')
            .gte('data_inicio', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
            .order('data_inicio', { ascending: false });
          
          if (!impError && importacoesData) {
            setRecentImports(importacoesData.length);
            
            // Obter última sincronização
            if (importacoesData.length > 0) {
              setLastSync(importacoesData[0].data_fim || importacoesData[0].data_inicio);
            }
          }

          // Buscar tendência de crescimento - comparar últimos 30 dias com 30 dias anteriores
          const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
          const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString();
          
          const [current, previous] = await Promise.all([
            supabase.from('convencoes').select('count').gte('created_at', thirtyDaysAgo),
            supabase.from('convencoes').select('count')
              .lt('created_at', thirtyDaysAgo)
              .gte('created_at', sixtyDaysAgo)
          ]);
          
          const currentCount = current.data?.length || 0;
          const previousCount = previous.data?.length || 0;
          
          if (previousCount === 0) {
            setConvTrend(currentCount > 0 ? 100 : 0);
          } else {
            const trendPercent = ((currentCount - previousCount) / previousCount) * 100;
            setConvTrend(Math.round(trendPercent));
          }

          // Buscar notificações
          const { data: notificationsData } = await supabase
            .from('feed_noticias')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5);
          
          if (notificationsData) {
            const mappedNotifications: Notification[] = notificationsData.map(item => ({
              id: item.id,
              title: item.titulo || 'Notificação',
              message: item.conteudo || '',
              timestamp: item.created_at,
              date: item.created_at, // Ensuring date is set for compatibility
              read: false
            }));
            
            setNotifications(mappedNotifications);
            setNotificationCount(mappedNotifications.length);
          }
        };
        
        await fetchData();
      } catch (error) {
        console.error("Erro ao verificar status do sistema:", error);
        setIsConnected(false);
      }
    };

    checkSystemStatus();
  }, []);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setNotificationCount(0);
  };

  return {
    isConnected,
    lastSync,
    notificationCount, // Now returning as number
    notifications,
    activeConventions,
    recentImports,
    convTrend, // Now returning as number
    markAllAsRead
  };
}
