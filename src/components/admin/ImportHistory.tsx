
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { HistoryTable } from "./import/HistoryTable";
import { HistoryEmptyState } from "./import/HistoryEmptyState";
import { ImportDetailsDialog } from "./import/ImportDetailsDialog";

export function ImportHistory() {
  const [historico, setHistorico] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [detalhesImportacao, setDetalhesImportacao] = useState<any | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [registrosProcessados, setRegistrosProcessados] = useState<any[]>([]);

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

  const calcularDuracao = (dataInicio: string, dataFim: string | null) => {
    if (!dataFim) return "Em andamento";
    
    const inicio = new Date(dataInicio).getTime();
    const fim = new Date(dataFim).getTime();
    const diff = (fim - inicio) / 1000; // em segundos
    
    if (diff < 60) {
      return `${Math.round(diff)} segundos`;
    } else if (diff < 3600) {
      return `${Math.round(diff/60)} minutos`;
    } else {
      const horas = Math.floor(diff/3600);
      const minutos = Math.round((diff % 3600) / 60);
      return `${horas}h ${minutos}m`;
    }
  };

  const toggleExpandRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const visualizarDetalhes = async (item: any) => {
    try {
      setDetalhesImportacao(item);
      
      if (item.registros_processados > 0) {
        // Buscar convenções relacionadas a esta importação
        const { data, error } = await supabase
          .from('convencoes')
          .select(`
            id, titulo, tipo, estado, data_base, vigencia_inicio, vigencia_fim,
            sindicatos(nome, cnpj),
            pisos_salariais(cargo, piso_salarial, carga_horaria)
          `)
          .order('created_at', { ascending: false })
          .limit(10); // Limitando a 10 registros como exemplo
        
        if (!error) {
          setRegistrosProcessados(data || []);
        } else {
          console.error("Erro ao buscar convenções:", error);
          setRegistrosProcessados([]);
        }
      }
      
      setDialogOpen(true);
    } catch (error) {
      console.error("Erro ao buscar detalhes:", error);
    }
  };

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
          <HistoryTable 
            historico={historico}
            expandedRow={expandedRow}
            toggleExpandRow={toggleExpandRow}
            visualizarDetalhes={visualizarDetalhes}
            renderBadgeStatus={renderBadgeStatus}
            formatarData={formatarData}
            calcularDuracao={calcularDuracao}
          />
        ) : (
          <HistoryEmptyState />
        )}
      </CardContent>

      <ImportDetailsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        importDetails={detalhesImportacao}
        registrosProcessados={registrosProcessados}
        formatarData={formatarData}
      />
    </Card>
  );
}
