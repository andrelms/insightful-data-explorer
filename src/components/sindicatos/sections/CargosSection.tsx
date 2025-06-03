
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/sindicatosUtils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface CargoDataItem {
  id: string;
  cargo: string;
  cbo: string | null;
  jornadas: any[];
  pisos: any[];
  valores: any[];
}

interface CargosSectionProps {
  cargoData: CargoDataItem[];
}

export function CargosSection({ cargoData }: CargosSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [expandedValoresHora, setExpandedValoresHora] = useState<Record<string, boolean>>({});

  const toggleValoresHora = (cargoId: string) => {
    setExpandedValoresHora(prev => ({
      ...prev,
      [cargoId]: !prev[cargoId]
    }));
  };

  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-muted/50 rounded-xl transition-all">
        <h4 className="font-medium text-sm text-accent-foreground">Cargos e Remuneração ({cargoData.length})</h4>
        <ChevronDown className={cn(
          "h-4 w-4 transition-transform",
          isExpanded && "transform rotate-180"
        )} />
      </CollapsibleTrigger>
      
      <CollapsibleContent className="space-y-4 mt-3">
        {cargoData.map((cargoItem) => (
          <div key={cargoItem.id} className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 flex flex-col hover:shadow-md transition-all duration-300">
            {/* Cargo Info */}
            <div className="mb-4 flex-shrink-0">
              <div className="font-semibold text-sm mb-2 text-slate-800 dark:text-slate-200">{cargoItem.cargo}</div>
              {cargoItem.cbo && (
                <div className="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-full inline-block">
                  CBO: {cargoItem.cbo}
                </div>
              )}
            </div>
            
            {/* Tabela de Carga Horária e Piso Salarial */}
            {(cargoItem.jornadas.length > 0 || cargoItem.pisos.length > 0) && (
              <div className="mb-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs font-medium">Carga Horária</TableHead>
                      <TableHead className="text-xs font-medium">Piso Salarial</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Ordenar por registro_idx e fazer merge das linhas */}
                    {(() => {
                      const jornadasOrdenadas = [...cargoItem.jornadas].sort((a, b) => (a.registro_idx || 0) - (b.registro_idx || 0));
                      const pisosOrdenados = [...cargoItem.pisos].sort((a, b) => (a.registro_idx || 0) - (b.registro_idx || 0));
                      const maxRows = Math.max(jornadasOrdenadas.length, pisosOrdenados.length, 1);
                      
                      return Array.from({ length: maxRows }, (_, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="text-xs">
                            {jornadasOrdenadas[idx] ? (
                              <div className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-xl font-medium">
                                {jornadasOrdenadas[idx].valor} {jornadasOrdenadas[idx].unidade}
                              </div>
                            ) : (
                              <div className="text-muted-foreground">-</div>
                            )}
                          </TableCell>
                          <TableCell className="text-xs">
                            {pisosOrdenados[idx] ? (
                              <div className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 p-3 rounded-xl border border-green-200 dark:border-green-700">
                                <div className="font-semibold text-sm">
                                  {formatCurrency(pisosOrdenados[idx].valor)}
                                </div>
                                {pisosOrdenados[idx].descricao && pisosOrdenados[idx].descricao.toUpperCase() !== 'PISO SALARIAL' && (
                                  <div className="text-xs mt-1 opacity-80">{pisosOrdenados[idx].descricao}</div>
                                )}
                              </div>
                            ) : (
                              <div className="text-muted-foreground">-</div>
                            )}
                          </TableCell>
                        </TableRow>
                      ));
                    })()}
                  </TableBody>
                </Table>
              </div>
            )}
              
            {/* Valores Hora - Collapsible */}
            {cargoItem.valores.length > 0 && (
              <div className="mt-auto">
                <Collapsible 
                  open={expandedValoresHora[cargoItem.id]} 
                  onOpenChange={() => toggleValoresHora(cargoItem.id)}
                >
                  <CollapsibleTrigger className="flex items-center gap-2 text-xs font-medium hover:text-primary w-full text-left p-2 rounded-xl hover:bg-muted/30 transition-all">
                    <ChevronDown className={cn(
                      "h-3 w-3 transition-transform",
                      expandedValoresHora[cargoItem.id] && "transform rotate-180"
                    )} />
                    Valores Hora ({cargoItem.valores.length})
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-3">
                    <div className="grid grid-cols-1 gap-2">
                      {cargoItem.valores.map((valor, idx) => (
                        <div key={idx} className="bg-orange-100 dark:bg-orange-800 text-orange-800 dark:text-orange-200 p-3 rounded-xl text-xs border border-orange-200 dark:border-orange-700">
                          <div className="font-medium text-xs">{valor.descricao || 'Valor'}</div>
                          <div className="text-xs font-semibold">{formatCurrency(valor.valor)}</div>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            )}
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
