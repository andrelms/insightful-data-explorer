
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
import { FileText } from "lucide-react";

interface HistoryTableProps {
  historico: any[];
  expandedRow: string | null;
  toggleExpandRow: (id: string) => void;
  visualizarDetalhes: (item: any) => void;
  renderBadgeStatus: (status: string) => React.ReactNode;
  formatarData: (dataString: string) => string;
  calcularDuracao: (dataInicio: string, dataFim: string | null) => string;
}

export function HistoryTable({
  historico,
  expandedRow,
  toggleExpandRow,
  visualizarDetalhes,
  renderBadgeStatus,
  formatarData,
  calcularDuracao
}: HistoryTableProps) {
  return (
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
  );
}
