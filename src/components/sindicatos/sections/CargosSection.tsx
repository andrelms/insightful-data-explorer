
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";
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
  expandedValoresHora: Record<string, boolean>;
  onToggleValoresHora: (cargoId: string) => void;
}

export function CargosSection({ cargoData, expandedValoresHora, onToggleValoresHora }: CargosSectionProps) {
  return (
    <div className="space-y-2">
      <h4 className="font-medium text-xs text-accent-foreground">Cargos e Remuneração</h4>
      <div className="space-y-3">
        {cargoData.map((cargoItem) => (
          <div key={cargoItem.id} className="bg-muted/20 p-3 rounded border">
            {/* Cargo Info */}
            <div className="mb-3">
              <div className="font-medium text-sm">{cargoItem.cargo}</div>
              {cargoItem.cbo && (
                <div className="text-xs text-muted-foreground">CBO: {cargoItem.cbo}</div>
              )}
            </div>
            
            {/* Carga Horária e Piso Salarial lado a lado */}
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <div className="text-xs font-medium mb-1">Carga Horária</div>
                {cargoItem.jornadas.map((jornada, idx) => (
                  <div key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mb-1">
                    {jornada.valor} {jornada.unidade}
                  </div>
                ))}
              </div>
              <div>
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
            </div>
            
            {/* Valores Hora - Collapsible horizontal */}
            {cargoItem.valores.length > 0 && (
              <Collapsible 
                open={expandedValoresHora[cargoItem.id]} 
                onOpenChange={() => onToggleValoresHora(cargoItem.id)}
              >
                <CollapsibleTrigger className="flex items-center gap-2 text-xs font-medium hover:text-primary w-full text-left">
                  <ChevronRight className={cn(
                    "h-3 w-3 transition-transform",
                    expandedValoresHora[cargoItem.id] && "transform rotate-90"
                  )} />
                  Valores Hora ({cargoItem.valores.length})
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2">
                  <div className="flex flex-wrap gap-2">
                    {cargoItem.valores.map((valor, idx) => (
                      <div key={idx} className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
                        <div className="font-medium">{valor.descricao || 'Valor'}</div>
                        <div>{formatCurrency(valor.valor)}</div>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
