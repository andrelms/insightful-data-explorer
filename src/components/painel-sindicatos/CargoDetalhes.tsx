
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CargoCompleto } from "./types";

interface CargoDetalhesProps {
  cargoData: CargoCompleto;
}

export function CargoDetalhes({ cargoData }: CargoDetalhesProps) {
  const [expandedValoresHora, setExpandedValoresHora] = useState<Record<string, boolean>>({});

  const toggleValoresHora = (cargoId: string) => {
    setExpandedValoresHora(prev => ({
      ...prev,
      [cargoId]: !prev[cargoId]
    }));
  };

  const formatCurrency = (value: number | null) => {
    if (!value) return 'N/A';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="bg-muted/20 p-3 rounded border">
      <div className="mb-3">
        <div className="font-medium text-sm">{cargoData.cargo}</div>
        {cargoData.cbo && (
          <div className="text-xs text-muted-foreground">CBO: {cargoData.cbo}</div>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-2">
        <div>
          <div className="text-xs font-medium mb-1">Carga Horária</div>
          {cargoData.jornadas.map((jornada, idx) => (
            <div key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mb-1">
              {jornada.valor} {jornada.unidade}
            </div>
          ))}
        </div>
        <div>
          <div className="text-xs font-medium mb-1">Piso Salarial</div>
          {cargoData.pisos.map((piso, idx) => (
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
      
      {cargoData.valores.length > 0 && (
        <Collapsible 
          open={expandedValoresHora[cargoData.id]} 
          onOpenChange={() => toggleValoresHora(cargoData.id)}
        >
          <CollapsibleTrigger className="flex items-center gap-2 text-xs font-medium hover:text-primary w-full text-left">
            <ChevronRight className={cn(
              "h-3 w-3 transition-transform",
              expandedValoresHora[cargoData.id] && "transform rotate-90"
            )} />
            Valores Hora ({cargoData.valores.length})
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <div className="flex flex-wrap gap-2">
              {cargoData.valores.map((valor, idx) => (
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
  );
}
