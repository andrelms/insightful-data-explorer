
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
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedValoresHora, setExpandedValoresHora] = useState<Record<string, boolean>>({});

  const toggleValoresHora = (cargoId: string) => {
    setExpandedValoresHora(prev => ({
      ...prev,
      [cargoId]: !prev[cargoId]
    }));
  };

  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-muted/50 rounded">
        <h4 className="font-medium text-sm text-accent-foreground">Cargos e Remuneração ({cargoData.length})</h4>
        <ChevronDown className={cn(
          "h-4 w-4 transition-transform",
          isExpanded && "transform rotate-180"
        )} />
      </CollapsibleTrigger>
      
      <CollapsibleContent className="space-y-2 mt-2">
        {/* Grade responsiva para cargos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {cargoData.map((cargoItem) => (
            <div key={cargoItem.id} className="bg-muted/20 p-3 rounded border flex flex-col h-full">
              {/* Cargo Info */}
              <div className="mb-3">
                <div className="font-medium text-sm line-clamp-2">{cargoItem.cargo}</div>
                {cargoItem.cbo && (
                  <div className="text-xs text-muted-foreground">CBO: {cargoItem.cbo}</div>
                )}
              </div>
              
              {/* Carga Horária */}
              <div className="mb-2">
                <div className="text-xs font-medium mb-1">Carga Horária</div>
                {cargoItem.jornadas.map((jornada, idx) => (
                  <div key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mb-1">
                    {jornada.valor} {jornada.unidade}
                  </div>
                ))}
              </div>

              {/* Piso Salarial */}
              <div className="mb-2 flex-1">
                <div className="text-xs font-medium mb-1">Piso Salarial</div>
                {cargoItem.pisos.map((piso, idx) => (
                  <div key={idx} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs mb-1">
                    <div className="font-medium">
                      {formatCurrency(piso.valor)}
                      {piso.descricao && piso.descricao.toUpperCase() !== 'PISO SALARIAL' && (
                        <span className="text-xs ml-1">({piso.descricao})</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Valores Hora - Collapsible */}
              {cargoItem.valores.length > 0 && (
                <Collapsible 
                  open={expandedValoresHora[cargoItem.id]} 
                  onOpenChange={() => toggleValoresHora(cargoItem.id)}
                >
                  <CollapsibleTrigger className="flex items-center gap-2 text-xs font-medium hover:text-primary w-full text-left">
                    <ChevronDown className={cn(
                      "h-3 w-3 transition-transform",
                      expandedValoresHora[cargoItem.id] && "transform rotate-90"
                    )} />
                    Valores Hora ({cargoItem.valores.length})
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2">
                    <div className="flex flex-wrap gap-1">
                      {cargoItem.valores.map((valor, idx) => (
                        <div key={idx} className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
                          <div className="font-medium text-xs">{valor.descricao || 'Valor'}</div>
                          <div className="text-xs">{formatCurrency(valor.valor)}</div>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )}
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
