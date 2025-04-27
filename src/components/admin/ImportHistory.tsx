
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle } from "lucide-react";

export function ImportHistory() {
  const [historico, setHistorico] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistorico = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('historico_importacao')
          .select('*')
          .order('data_inicio', { ascending: false });

        if (!error) {
          setHistorico(data || []);
        } else {
          console.error("Erro ao buscar histórico:", error);
          setHistorico([]);
        }
      } catch (error) {
        console.error("Erro ao buscar histórico:", error);
        setHistorico([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistorico();
  }, []);

  const renderBadgeStatus = (status: string) => {
    switch (status) {
      case 'concluido':
        return <Badge variant="secondary" className="bg-green-500 text-white">Concluído</Badge>;
      case 'erro':
        return <Badge variant="destructive">Erro</Badge>;
      case 'em_andamento':
        return <Badge variant="outline" className="bg-blue-100 text-blue-700">Em andamento</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatarData = (dataString: string) => {
    try {
      const data = new Date(dataString);
      return data.toLocaleDateString('pt-BR') + ' ' + data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return dataString;
    }
  };

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
      <h3 className="text-lg font-medium">Nenhum registro encontrado</h3>
      <p className="text-sm text-muted-foreground mt-1">
        O histórico de importações está vazio ou foi limpo recentemente.
      </p>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Importações</CardTitle>
        <CardDescription>
          Registros das importações realizadas no sistema.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-pulse flex space-x-4">
              <div className="space-y-2 w-full">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-10 bg-muted rounded w-full"></div>
                ))}
              </div>
            </div>
          </div>
        ) : historico.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Origem</TableHead>
                <TableHead>Registros</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {historico.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{formatarData(item.data_inicio)}</TableCell>
                  <TableCell>{item.origem || "Sistema"}</TableCell>
                  <TableCell>{item.registros_processados ?? "-"}</TableCell>
                  <TableCell>{renderBadgeStatus(item.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          renderEmptyState()
        )}
      </CardContent>
    </Card>
  );
}
