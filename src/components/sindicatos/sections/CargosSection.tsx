
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/sindicatosUtils";

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
      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-muted/50 rounded-lg transition-all">
        <h4 className="font-medium text-sm text-accent-foreground">Cargos e Remuneração ({cargoData.length})</h4>
        <ChevronDown className={cn(
          "h-4 w-4 transition-transform",
          isExpanded && "transform rotate-180"
        )} />
      </CollapsibleTrigger>
      
      <CollapsibleContent className="space-y-4 mt-3">
        {cargoData.map((cargoItem) => (
          <div key={cargoItem.id} className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
            {/* Cargo Info */}
            <div className="mb-4">
              <div className="font-semibold text-sm mb-2 text-slate-800 dark:text-slate-200">{cargoItem.cargo}</div>
              {cargoItem.cbo && (
                <div className="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-md inline-block">
                  CBO: {cargoItem.cbo}
                </div>
              )}
            </div>
            
            {/* Carga Horária e Piso Salarial lado a lado */}
            {(cargoItem.jornadas.length > 0 || cargoItem.pisos.length > 0) && (
              <div className="mb-4">
                {(() => {
                  const jornadasOrdenadas = [...cargoItem.jornadas].sort((a, b) => (a.registro_idx || 0) - (b.registro_idx || 0));
                  const pisosOrdenados = [...cargoItem.pisos].sort((a, b) => (a.registro_idx || 0) - (b.registro_idx || 0));
                  const maxRows = Math.max(jornadasOrdenadas.length, pisosOrdenados.length, 1);
                  
                  return Array.from({ length: maxRows }, (_, idx) => (
                    <div key={idx} className="flex gap-4 mb-3">
                      {/* Carga Horária */}
                      <div className="flex-1">
                        <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Carga Horária</div>
                        {jornadasOrdenadas[idx] ? (
                          <div className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-3 py-2 rounded-lg font-medium text-sm">
                            {jornadasOrdenadas[idx].valor} {jornadasOrdenadas[idx].unidade}
                          </div>
                        ) : (
                          <div className="text-muted-foreground text-sm">-</div>
                        )}
                      </div>
                      
                      {/* Piso Salarial */}
                      <div className="flex-1">
                        <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Piso Salarial</div>
                        {pisosOrdenados[idx] ? (
                          <div className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 p-3 rounded-lg border border-green-200 dark:border-green-700">
                            <div className="font-semibold text-sm">
                              {formatCurrency(pisosOrdenados[idx].valor)}
                            </div>
                            {pisosOrdenados[idx].descricao && pisosOrdenados[idx].descricao.toUpperCase() !== 'PISO SALARIAL' && (
                              <div className="text-xs mt-1 opacity-80">{pisosOrdenados[idx].descricao}</div>
                            )}
                          </div>
                        ) : (
                          <div className="text-muted-foreground text-sm">-</div>
                        )}
                      </div>
                    </div>
                  ));
                })()}
              </div>
            )}
              
            {/* Valores Hora - Collapsible */}
            {cargoItem.valores.length > 0 && (
              <div className="mt-auto">
                <Collapsible 
                  open={expandedValoresHora[cargoItem.id]} 
                  onOpenChange={() => toggleValoresHora(cargoItem.id)}
                >
                  <CollapsibleTrigger className="flex items-center gap-2 text-xs font-medium hover:text-primary w-full text-left p-2 rounded-lg hover:bg-muted/30 transition-all">
                    <ChevronDown className={cn(
                      "h-3 w-3 transition-transform",
                      expandedValoresHora[cargoItem.id] && "transform rotate-180"
                    )} />
                    Valores Hora ({cargoItem.valores.length})
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-3">
                    <div className="grid grid-cols-1 gap-2">
                      {cargoItem.valores.map((valor, idx) => (
                        <div key={idx} className="bg-orange-100 dark:bg-orange-800 text-orange-800 dark:text-orange-200 p-3 rounded-lg text-xs border border-orange-200 dark:border-orange-700">
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
