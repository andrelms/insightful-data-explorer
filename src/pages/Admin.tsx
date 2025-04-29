
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

const Admin = () => {
  const navigate = useNavigate();
  const [notificationCount, setNotificationCount] = useState(0);
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
      } catch (error) {
        console.error("Erro ao buscar status do sistema:", error);
        setIsConnected(false);
      }
    };
    
    fetchSystemStatus();
  }, []);
  
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
            <div className="flex items-center gap-1">
              <Bell className="h-4 w-4" />
              <Badge variant="outline" className="bg-white/20 hover:bg-white/30 text-white border-transparent">
                {notificationCount.toString()}
              </Badge>
            </div>
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
