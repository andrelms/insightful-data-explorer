
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Database, Settings, FileText, AlertCircle, Bell } from "lucide-react";
import { DatabaseManagement } from "@/components/admin/DatabaseManagement";
import { ImportSection } from "@/components/admin/ImportSection";
import { ConfigSection } from "@/components/admin/ConfigSection";
import { LogsSection } from "@/components/admin/LogsSection";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";

const Admin = () => {
  const navigate = useNavigate();
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(true);

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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Área Administrativa</h1>
        <p className="text-muted-foreground">
          Gerencie a importação de dados, configure o banco de dados e monitore o sistema.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader className="bg-gradient-to-r from-blue-600/90 to-violet-600/90 text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Status do Sistema
            </CardTitle>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/20 hover:text-white">
                  <Bell className="h-5 w-5" />
                  {notificationCount > 0 && (
                    <Badge variant="outline" className="absolute -top-1 -right-1 bg-white/20 hover:bg-white/30 text-white border-transparent">
                      {notificationCount.toString()}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0">
                <div className="p-4 border-b">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Notificações do Sistema</h3>
                    {notificationCount > 0 && (
                      <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                        Marcar como lidas
                      </Button>
                    )}
                  </div>
                </div>
                <div className="max-h-[300px] overflow-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification, i) => (
                      <div key={notification.id || i} className={`p-4 border-b last:border-0 ${notification.read ? 'bg-background' : 'bg-muted/30'}`}>
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm font-medium">{notification.title}</h4>
                          <span className="text-xs text-muted-foreground">{notification.date}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      Nenhuma notificação disponível
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <CardDescription className="text-blue-100">
            Monitore o estado atual do sistema e acesse funções administrativas.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 grid gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-2 p-4 border rounded-lg">
            <h3 className="text-sm font-semibold">Recursos do Sistema</h3>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <Button variant="outline" size="sm" onClick={() => navigate("/")}>Dashboard</Button>
              <Button variant="outline" size="sm" onClick={() => navigate("/processar-dados")}>Processar Dados</Button>
              <Button variant="outline" size="sm" onClick={() => navigate("/painel-sindicatos")}>Painel Sindicatos</Button>
              <Button variant="outline" size="sm" onClick={() => navigate("/convencoes")}>Convenções</Button>
            </div>
          </div>
          <div className="flex flex-col gap-2 p-4 border rounded-lg">
            <h3 className="text-sm font-semibold">Banco de Dados</h3>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-muted-foreground">Conexão</span>
              <div className="flex items-center gap-1">
                <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm">{isConnected ? 'Ativa' : 'Inativa'}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Última sincronização</span>
              <span className="text-sm">{lastSync || "0"}</span>
            </div>
          </div>
        </CardContent>
      </Card>

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
    </div>
  );
};

export default Admin;
