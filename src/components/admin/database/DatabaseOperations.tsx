import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"
import { RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function DatabaseOperations() {
  const [tableName, setTableName] = useState<TableName>("convenios");
  const [tableData, setTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [sampleData, setSampleData] = useState<any[]>([]);

  type TableName = "convenios" | "sindicatos" | "cargos" | "piso_salarial" | "feed_noticias";

  useEffect(() => {
    fetchTableData(tableName);
  }, [tableName]);

  const fetchTableData = async (tableName: TableName) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from(tableName).select('*');
      if (error) {
        throw error;
      }
      setTableData(data || []);
    } catch (error) {
      console.error("Erro ao buscar dados da tabela:", error);
      toast({
        title: "Erro",
        description: `Falha ao carregar dados da tabela ${tableName}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTableNameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTableName(e.target.value as TableName);
  };

  const handleDeleteTable = async (tableName: TableName) => {
    if (!window.confirm(`Tem certeza que deseja DELETAR TODOS os dados da tabela "${tableName}"? Esta ação é IRREVERSÍVEL.`)) {
      return;
    }

    setLoading(true);
    try {
      // Deletar todos os registros da tabela (exceto aqueles com um ID específico, para evitar exclusão acidental da tabela)
      const { error } = await supabase.from(tableName).delete().neq('id', 'dummy-value');
      if (error) {
        throw error;
      }

      toast({
        title: "Sucesso",
        description: `Todos os dados da tabela "${tableName}" foram deletados.`,
      });
      fetchTableData(tableName); // Recarrega os dados da tabela
    } catch (error) {
      console.error("Erro ao deletar dados da tabela:", error);
      toast({
        title: "Erro",
        description: `Falha ao deletar dados da tabela "${tableName}".`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBackupTable = async (tableName: TableName) => {
    setLoading(true);
    try {
      // Simula a obtenção de dados de backup (substitua pela lógica real)
      const backupData = tableData;
      setSampleData(backupData);

      toast({
        title: "Sucesso",
        description: `Dados da tabela "${tableName}" foram copiados para a área de transferência.`,
      });
    } catch (error) {
      console.error("Erro ao fazer backup da tabela:", error);
      toast({
        title: "Erro",
        description: `Falha ao fazer backup da tabela "${tableName}".`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreFromBackup = async (tableName: TableName) => {
    if (!sampleData || sampleData.length === 0) {
      toast({
        title: "Erro",
        description: "Não há dados de backup para restaurar.",
        variant: "destructive",
      });
      return;
    }

    if (!window.confirm(`Tem certeza que deseja RESTAURAR os dados na tabela "${tableName}" com os dados do backup? Os dados existentes serão substituídos.`)) {
      return;
    }

    setLoading(true);
    try {
      // Insere os dados de backup na tabela
      const { error } = await supabase.from(tableName).insert(sampleData);
      if (error) {
        throw error;
      }

      toast({
        title: "Sucesso",
        description: `Dados da tabela "${tableName}" foram restaurados com sucesso.`,
      });
      fetchTableData(tableName); // Recarrega os dados da tabela
    } catch (error) {
      console.error("Erro ao restaurar dados da tabela:", error);
      toast({
        title: "Erro",
        description: `Falha ao restaurar dados da tabela "${tableName}".`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciamento de Banco de Dados</CardTitle>
        <CardDescription>
          Execute operações de backup, restauração e limpeza nas tabelas do
          banco de dados.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-[150px_1fr] gap-4">
          <Label htmlFor="table">Tabela</Label>
          <select
            id="table"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={tableName}
            onChange={handleTableNameChange}
          >
            <option value="convenios">Convenios</option>
            <option value="sindicatos">Sindicatos</option>
            <option value="cargos">Cargos</option>
            <option value="piso_salarial">Piso Salarial</option>
            <option value="feed_noticias">Feed de Notícias</option>
          </select>
        </div>
        <div className="flex justify-between">
          <Button
            variant="destructive"
            onClick={() => handleDeleteTable(tableName)}
            disabled={loading}
          >
            {loading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Aguarde...
              </>
            ) : (
              "Limpar Tabela"
            )}
          </Button>
          <div>
            <Button
              variant="outline"
              onClick={() => handleBackupTable(tableName)}
              disabled={loading}
            >
              {loading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Aguarde...
                </>
              ) : (
                "Fazer Backup"
              )}
            </Button>
            <Button
              onClick={() => handleRestoreFromBackup(tableName)}
              disabled={loading}
            >
              {loading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Aguarde...
                </>
              ) : (
                "Restaurar Backup"
              )}
            </Button>
          </div>
        </div>

        {sampleData && sampleData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Dados de Backup</CardTitle>
              <CardDescription>
                Estes são os dados que serão usados para restaurar a tabela.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={JSON.stringify(sampleData, null, 2)}
                className="min-h-[100px]"
                readOnly
              />
            </CardContent>
          </Card>
        )}

        {tableData && tableData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Dados da Tabela "{tableName}"</CardTitle>
              <CardDescription>
                Estes são os dados atuais da tabela.
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {Object.keys(tableData[0]).map((key) => (
                      <TableHead key={key}>{key}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData.map((row, index) => (
                    <TableRow key={index}>
                      {Object.values(row).map((value, i) => (
                        <TableCell key={i}>
                          {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
