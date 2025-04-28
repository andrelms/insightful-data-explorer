
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle, ChevronDown, ChevronUp, FileText, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
        // Em um caso real, você precisaria de um campo na tabela convenções que relacione com a importação
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
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-9"></TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Origem</TableHead>
                  <TableHead>Duração</TableHead>
                  <TableHead>Registros</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historico.map((item) => (
                  <>
                    <TableRow key={item.id} className="hover:bg-muted/50">
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => toggleExpandRow(item.id)}
                        >
                          {expandedRow === item.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                      </TableCell>
                      <TableCell>{formatarData(item.data_inicio)}</TableCell>
                      <TableCell>{item.origem || "Sistema"}</TableCell>
                      <TableCell>{calcularDuracao(item.data_inicio, item.data_fim)}</TableCell>
                      <TableCell>{item.registros_processados ?? "-"}</TableCell>
                      <TableCell>{renderBadgeStatus(item.status)}</TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => visualizarDetalhes(item)}
                        >
                          <Info className="h-4 w-4" />
                          <span className="sr-only">Ver detalhes</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                    {expandedRow === item.id && (
                      <TableRow>
                        <TableCell colSpan={7}>
                          <div className="bg-muted/30 rounded-md p-3 my-1 text-sm">
                            <p><strong>Detalhes da importação:</strong></p>
                            {item.detalhes ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                                {(() => {
                                  try {
                                    const detalhes = JSON.parse(item.detalhes);
                                    return Object.entries(detalhes).map(([chave, valor]: [string, any]) => (
                                      <div key={chave} className="flex">
                                        <span className="font-medium min-w-[100px]">{chave}:</span>
                                        <span className="ml-2">
                                          {Array.isArray(valor) 
                                            ? valor.join(", ") 
                                            : typeof valor === 'object' 
                                              ? JSON.stringify(valor)
                                              : String(valor)
                                          }
                                        </span>
                                      </div>
                                    ));
                                  } catch (e) {
                                    return <p>{item.detalhes}</p>;
                                  }
                                })()}
                              </div>
                            ) : (
                              <p className="text-muted-foreground">Nenhum detalhe disponível</p>
                            )}

                            {item.status === 'concluido' && (
                              <div className="mt-3">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => visualizarDetalhes(item)}
                                >
                                  <FileText className="h-4 w-4 mr-2" />
                                  Ver dados importados
                                </Button>
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          renderEmptyState()
        )}
      </CardContent>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes da Importação</DialogTitle>
            <DialogDescription>
              {detalhesImportacao && (
                <>
                  Importação realizada em {formatarData(detalhesImportacao.data_inicio)} 
                  {detalhesImportacao.data_fim && ` e concluída em ${formatarData(detalhesImportacao.data_fim)}`}.
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {registrosProcessados.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Convenções Importadas:</h3>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Sindicato</TableHead>
                      <TableHead>Data Base</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {registrosProcessados.map((registro) => (
                      <TableRow key={registro.id}>
                        <TableCell>{registro.titulo}</TableCell>
                        <TableCell>{registro.tipo}</TableCell>
                        <TableCell>{registro.estado}</TableCell>
                        <TableCell>
                          {registro.sindicatos?.nome || "-"}
                          {registro.sindicatos?.cnpj && (
                            <div className="text-xs text-muted-foreground mt-1">
                              CNPJ: {registro.sindicatos.cnpj}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {registro.data_base ? new Date(registro.data_base).toLocaleDateString('pt-BR') : "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {registrosProcessados.some(reg => reg.pisos_salariais?.length > 0) && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-3">Pisos Salariais:</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {registrosProcessados.map((registro) => 
                      registro.pisos_salariais?.map((piso: any) => (
                        <Card key={`${registro.id}-${piso.cargo}`} className="overflow-hidden">
                          <CardHeader className="bg-muted/30 py-3">
                            <CardTitle className="text-base">{piso.cargo}</CardTitle>
                            <CardDescription>
                              {piso.carga_horaria || "Carga horária não especificada"}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pt-4">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Piso Salarial:</span>
                              <span className="font-medium">
                                {piso.piso_salarial ? `R$ ${parseFloat(piso.piso_salarial).toLocaleString('pt-BR', {minimumFractionDigits: 2})}` : "-"}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ).flat()}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground">Nenhum registro detalhado disponível para esta importação</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
