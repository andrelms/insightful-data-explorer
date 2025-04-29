
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface LogEntry {
  id: string;
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR";
  message: string;
  module: string;
}

export function LogsSection() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      // Verificar se existe a tabela system_logs no banco
      const { data: tableExists } = await supabase
        .from('system_logs')
        .select('id')
        .limit(1);
      
      if (tableExists && tableExists.length > 0) {
        // Buscar logs do banco de dados
        const { data, error } = await supabase
          .from('system_logs')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(20);
        
        if (error) throw error;
        if (data && data.length > 0) {
          setLogs(data as LogEntry[]);
        } else {
          // Se não há dados, usar logs mockados
          setLogs(getMockLogs());
        }
      } else {
        // Se a tabela não existe, usar logs mockados
        setLogs(getMockLogs());
      }
    } catch (error) {
      console.error('Erro ao carregar logs:', error);
      // Em caso de erro, usar logs mockados
      setLogs(getMockLogs());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const getMockLogs = (): LogEntry[] => {
    return [
      {
        id: "1",
        timestamp: "25/04/2023 15:32:45",
        level: "WARN",
        message: "Tentativa de acesso com credenciais inválidas",
        module: "auth"
      },
      {
        id: "2",
        timestamp: "25/04/2023 14:56:12",
        level: "INFO",
        message: "Importação de dados concluída com sucesso",
        module: "import"
      },
      {
        id: "3",
        timestamp: "25/04/2023 14:30:05",
        level: "INFO",
        message: "Início da importação de dados do MTE",
        module: "import"
      },
      {
        id: "4",
        timestamp: "25/04/2023 12:23:18",
        level: "ERROR",
        message: "Falha na conexão com servidor externo",
        module: "api"
      },
      {
        id: "5",
        timestamp: "25/04/2023 10:15:42",
        level: "INFO",
        message: "Usuário admin@sindicato.org autenticado",
        module: "auth"
      }
    ];
  };

  const handleExportLogs = () => {
    try {
      // Criar um arquivo JSON com os logs
      const dataStr = JSON.stringify(logs, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `system_logs_${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast({
        title: "Logs exportados",
        description: "Os logs foram exportados com sucesso.",
        duration: 5000,
      });
    } catch (error) {
      console.error('Erro ao exportar logs:', error);
      toast({
        title: "Erro",
        description: "Não foi possível exportar os logs.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Logs do Sistema
          </CardTitle>
          <CardDescription>
            Registros de atividades e erros do sistema.
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchLogs} 
            disabled={isLoading}
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            <span className="ml-2">Atualizar</span>
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportLogs}>
            <Download className="h-4 w-4 mr-2" />
            Exportar Logs
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="max-h-[400px] overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Timestamp</TableHead>
                <TableHead className="w-[100px]">Nível</TableHead>
                <TableHead>Mensagem</TableHead>
                <TableHead className="w-[120px]">Módulo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto" />
                    <div className="mt-2 text-sm text-muted-foreground">Carregando logs...</div>
                  </TableCell>
                </TableRow>
              ) : logs.length > 0 ? (
                logs.map((log, index) => (
                  <TableRow key={log.id || index}>
                    <TableCell>{log.timestamp}</TableCell>
                    <TableCell>
                      <Badge 
                        className={
                          log.level === "ERROR" ? "bg-red-500" : 
                          log.level === "WARN" ? "bg-yellow-500" : 
                          "variant-outline"
                        }
                      >
                        {log.level}
                      </Badge>
                    </TableCell>
                    <TableCell>{log.message}</TableCell>
                    <TableCell>{log.module}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6">
                    Nenhum log encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
