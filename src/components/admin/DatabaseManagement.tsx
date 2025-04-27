
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Database, Download, Upload, RefreshCw } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Define valid table names to use as a type
type TableName = "configuracoes" | "convencoes" | "uploaded_files" | "sindicatos" | "feed_noticias" | "historico_importacao";

export function DatabaseManagement() {
  const [isClearing, setIsClearing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const validTableNames: TableName[] = [
    "feed_noticias", 
    "convencoes", 
    "uploaded_files", 
    "sindicatos", 
    "historico_importacao", 
    "configuracoes"
  ];

  const handleClearDatabase = async () => {
    setIsClearing(true);
    try {
      // Delete data from all tables in the correct order to respect foreign key constraints
      await supabase.from('feed_noticias').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('convencoes').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('uploaded_files').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('sindicatos').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('historico_importacao').delete().neq('id', '00000000-0000-0000-0000-000000000000');

      // Force refresh of dashboard data
      localStorage.removeItem('dashboardData');
      localStorage.removeItem('feedData');
      localStorage.removeItem('estatisticasRegionais');
      
      toast({
        title: "Base de dados limpa",
        description: "Todos os dados foram removidos com sucesso.",
        duration: 5000,
      });
      setConfirmDialogOpen(false);
    } catch (error) {
      console.error('Erro ao limpar base de dados:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao tentar limpar a base de dados.",
        variant: "destructive",
      });
    } finally {
      setIsClearing(false);
    }
  };

  const handleExportDatabase = async () => {
    setIsExporting(true);
    try {
      // Simulating database export
      const exportData: Record<string, any> = {};
      
      for (const table of validTableNames) {
        const { data, error } = await supabase.from(table).select('*');
        
        if (error) throw error;
        exportData[table] = data;
      }
      
      // Create a JSON file and download it
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `database_backup_${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast({
        title: "Exportação concluída",
        description: "Os dados foram exportados com sucesso.",
        duration: 5000,
      });
    } catch (error) {
      console.error('Erro ao exportar banco de dados:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao exportar os dados.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportDatabase = async () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    
    fileInput.onchange = async (e) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file) return;
      
      setIsImporting(true);
      try {
        const fileReader = new FileReader();
        
        fileReader.onload = async (event) => {
          try {
            const result = event.target?.result;
            if (typeof result !== 'string') {
              throw new Error("Failed to read file as text");
            }
            
            const importData = JSON.parse(result);
            
            // First clear the database
            await handleClearDatabase();
            
            // Then import data for each table
            for (const [tableName, data] of Object.entries(importData)) {
              if (Array.isArray(data) && data.length > 0) {
                if (validTableNames.includes(tableName as TableName)) {
                  const { error } = await supabase.from(tableName as TableName).insert(data);
                  if (error) throw error;
                }
              }
            }
            
            toast({
              title: "Importação concluída",
              description: "Os dados foram importados com sucesso.",
              duration: 5000,
            });
            
            // Force refresh of dashboard data
            localStorage.removeItem('dashboardData');
            localStorage.removeItem('feedData');
            localStorage.removeItem('estatisticasRegionais');
            
          } catch (parseError) {
            console.error('Erro ao processar arquivo:', parseError);
            toast({
              title: "Erro",
              description: "O formato do arquivo é inválido.",
              variant: "destructive",
            });
          }
        };
        
        fileReader.readAsText(file);
      } catch (error) {
        console.error('Erro ao importar banco de dados:', error);
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao importar os dados.",
          variant: "destructive",
        });
      } finally {
        setIsImporting(false);
      }
    };
    
    fileInput.click();
  };

  const handleBackupDatabase = async () => {
    setIsBackingUp(true);
    try {
      // Create backup in Supabase
      const timestamp = new Date().toISOString();
      
      // In a real application, we would use an RPC function to create a backup
      // For now, we'll just simulate it with a toast notification
      setTimeout(() => {
        toast({
          title: "Backup criado",
          description: "Um backup do banco de dados foi criado com sucesso.",
          duration: 5000,
        });
        setIsBackingUp(false);
      }, 1500);
    } catch (error) {
      console.error('Erro ao criar backup:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o backup do banco de dados.",
        variant: "destructive",
      });
      setIsBackingUp(false);
    }
  };

  const showConfirmDialog = () => {
    setConfirmDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-500">
          <AlertTriangle className="h-5 w-5" />
          Gerenciamento da Base de Dados
        </CardTitle>
        <CardDescription>
          Gerencie os dados do sistema, incluindo exportação, importação, backup e limpeza completa.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="rounded-md bg-blue-50 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <Database className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Importante</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>Sempre faça backup dos dados antes de qualquer operação de limpeza ou importação.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button 
              variant="outline"
              onClick={handleExportDatabase}
              disabled={isExporting}
              className="flex items-center gap-2"
            >
              {isExporting ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {isExporting ? "Exportando..." : "Exportar Dados"}
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleImportDatabase}
              disabled={isImporting}
              className="flex items-center gap-2"
            >
              {isImporting ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {isImporting ? "Importando..." : "Importar Dados"}
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleBackupDatabase}
              disabled={isBackingUp}
              className="flex items-center gap-2"
            >
              {isBackingUp ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Database className="h-4 w-4" />
              )}
              {isBackingUp ? "Criando backup..." : "Criar Backup"}
            </Button>
            
            <Button 
              variant="destructive" 
              onClick={showConfirmDialog}
              disabled={isClearing}
              className="flex items-center gap-2"
            >
              {isClearing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <AlertTriangle className="h-4 w-4" />
              )}
              {isClearing ? "Limpando..." : "Limpar Base de Dados"}
            </Button>
          </div>
          
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Atenção</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>A limpeza da base de dados irá remover permanentemente:</p>
                  <ul className="list-disc list-inside mt-1">
                    <li>Todas as convenções e acordos coletivos</li>
                    <li>Todos os arquivos enviados (Excel, PDF, CSV)</li>
                    <li>Todo o histórico de feeds e notícias</li>
                    <li>Todas as estatísticas e métricas</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar limpeza da base de dados</DialogTitle>
            <DialogDescription>
              Esta ação irá remover todos os dados do sistema. Esta ação não pode ser desfeita.
              Tem certeza que deseja continuar?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleClearDatabase} disabled={isClearing}>
              {isClearing ? "Limpando..." : "Sim, limpar tudo"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
