
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Database, Settings, FileText } from "lucide-react";
import { DatabaseManagement } from "@/components/admin/DatabaseManagement";
import { ImportSection } from "@/components/admin/ImportSection";
import { ConfigSection } from "@/components/admin/ConfigSection";
import { LogsSection } from "@/components/admin/LogsSection";
import { StatusCard } from "@/components/admin/StatusCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Scale, RefreshCw, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

const Admin = () => {
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(true);
  const [activeConventions, setActiveConventions] = useState(0);
  const [recentImports, setRecentImports] = useState(0);
  const [convTrend, setConvTrend] = useState({value: 0.05, trend: 'up'});

  // Buscar dados de status do sistema ao carregar
  useEffect(() => {
    const fetchSystemStatus = async () => {
      try {
        // Verificar conexão com o banco
        const { data: connectionTest, error: connectionError } = await supabase
          .from('configuracoes')
          .select('count(*)')
          .limit(1)
          .single();
          
        setIsConnected(!connectionError);
        
        // Buscar última atualização
        const { data: lastUpdate, error: updateError } = await supabase
          .from('convencoes')
          .select('updated_at')
          .order('updated_at', { ascending: false })
          .limit(1)
          .single();
          
        if (!updateError && lastUpdate) {
          setLastSync(new Date(lastUpdate.updated_at).toLocaleDateString());
        } else {
          // Tentar obter de uploads
          const { data: lastUpload } = await supabase
            .from('uploaded_files')
            .select('uploaded_at')
            .order('uploaded_at', { ascending: false })
            .limit(1)
            .single();
            
          if (lastUpload) {
            setLastSync(new Date(lastUpload.uploaded_at).toLocaleDateString());
          } else {
            // Se não encontrar nenhum, usar "0" ao invés de null
            setLastSync("0");
          }
        }
        
        // Buscar notificações (logs de erro)
        const { data: errorLogs, error: logsError } = await supabase
          .from('system_logs')
          .select('count')
          .eq('level', 'ERROR')
          .single();
          
        if (!logsError && errorLogs) {
          setNotificationCount(parseInt(errorLogs.count) || 0);
        }
        
        // Buscar últimas notificações
        const { data: recentLogs, error: recentLogsError } = await supabase
          .from('system_logs')
          .select('id, timestamp, level, message, module')
          .order('timestamp', { ascending: false })
          .limit(5);
          
        if (!recentLogsError && recentLogs) {
          setNotifications(recentLogs.map(log => ({
            id: log.id,
            title: `${log.level}: ${log.module || 'Sistema'}`,
            message: log.message,
            date: new Date(log.timestamp).toLocaleString(),
            read: false
          })));
        }
      } catch (error) {
        console.error("Erro ao buscar status do sistema:", error);
        setIsConnected(false);
      }
    };
    
    fetchSystemStatus();
  }, []);

  const markAllAsRead = async () => {
    try {
      // Atualizar sistema de logs como lidos (aqui seria o código real)
      // Por enquanto apenas atualizamos a interface
      setNotificationCount(0);
      setNotifications(prev => prev.map(n => ({...n, read: true})));
      
      toast({
        title: "Notificações marcadas como lidas",
        description: "Todas as notificações foram marcadas como lidas.",
      });
    } catch (error) {
      console.error("Erro ao marcar notificações como lidas:", error);
    }
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Painel de Administração</h1>
        <p className="text-muted-foreground">
          Gerencie dados, defina configurações e monitore o sistema.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="card p-6 border rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Scale className="h-6 w-6 text-primary" />
              <h3 className="font-medium">Convenções</h3>
            </div>
            <Button size="sm" variant="outline">Ver todas</Button>
          </div>
          <p className="text-3xl font-bold">{activeConventions}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-muted-foreground">Ativas</span>
            <div className="flex items-center text-xs">
              <span className={`${convTrend.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {convTrend.value * 100}%
              </span>
            </div>
          </div>
        </div>

        <div className="card p-6 border rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-6 w-6 text-orange-500" />
              <h3 className="font-medium">Processamentos</h3>
            </div>
            <Button size="sm" variant="outline">Histórico</Button>
          </div>
          <p className="text-3xl font-bold">{recentImports}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-muted-foreground">Últimos 30 dias</span>
            <div className="flex items-center text-xs">
              <span className="text-green-500">5%</span>
            </div>
          </div>
        </div>
        
        <div className="card p-6 border rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bell className="h-6 w-6 text-blue-500" />
              <h3 className="font-medium">Notificações</h3>
            </div>
            <Button size="sm" variant="outline">Ver todas</Button>
          </div>
          <p className="text-3xl font-bold">{notificationCount.toString()}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-muted-foreground">Não lidas</span>
            <div className="flex items-center text-xs">
              <span className="text-red-500">15%</span>
            </div>
          </div>
        </div>
      </div>

      <StatusCard 
        value={notificationCount.toString()} 
        icon={<Bell className="h-5 w-5" />}
        trend="up"
        trendValue="12%"
      />

      <AdminTabs />
    </div>
  );
};

// Separate component for the tabs section
function AdminTabs() {
  return (
    <Tabs defaultValue="import" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="import">
          <Upload className="h-4 w-4 mr-2" />
          Importação
        </TabsTrigger>
        <TabsTrigger value="database">
          <Database className="h-4 w-4 mr-2" />
          Banco de Dados
        </TabsTrigger>
        <TabsTrigger value="config">
          <Settings className="h-4 w-4 mr-2" />
          Configurações
        </TabsTrigger>
        <TabsTrigger value="logs">
          <FileText className="h-4 w-4 mr-2" />
          Logs
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="import">
        <ImportSection />
      </TabsContent>
      
      <TabsContent value="database">
        <div className="grid gap-6">
          <DatabaseManagement />
        </div>
      </TabsContent>
      
      <TabsContent value="config">
        <ConfigSection />
      </TabsContent>
      
      <TabsContent value="logs">
        <LogsSection />
      </TabsContent>
    </Tabs>
  );
}

export default Admin;
