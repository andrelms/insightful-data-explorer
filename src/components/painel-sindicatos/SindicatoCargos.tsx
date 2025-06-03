
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { SindicatoData, CargoCompleto } from "./types";
import { CargoDetalhes } from "./CargoDetalhes";

interface SindicatoCargosProps {
  sindicato: SindicatoData;
}

export function SindicatoCargos({ sindicato }: SindicatoCargosProps) {
  const [expandedCargos, setExpandedCargos] = useState<Record<string, boolean>>({});

  const toggleCargos = (sindicatoId: string) => {
    setExpandedCargos(prev => ({
      ...prev,
      [sindicatoId]: !prev[sindicatoId]
    }));
  };

  const prepareCargoData = (sindicato: SindicatoData): CargoCompleto[] => {
    const cargoDataMap = new Map();
    
    sindicato.cargos.forEach(cargo => {
      if (!cargoDataMap.has(cargo.id)) {
        cargoDataMap.set(cargo.id, {
          id: cargo.id,
          cargo: cargo.cargo,
          cbo: cargo.cbo,
          jornadas: [],
          pisos: [],
          valores: []
        });
      }
    });
    
    sindicato.jornadas.forEach(jornada => {
      if (cargoDataMap.has(jornada.cargo_id)) {
        cargoDataMap.get(jornada.cargo_id).jornadas.push(jornada);
      }
    });
    
    sindicato.pisosSalariais.forEach(piso => {
      if (cargoDataMap.has(piso.cargo_id)) {
        cargoDataMap.get(piso.cargo_id).pisos.push(piso);
      }
    });
    
    sindicato.valoresHora.forEach(valor => {
      if (cargoDataMap.has(valor.cargo_id)) {
        cargoDataMap.get(valor.cargo_id).valores.push(valor);
      }
    });
    
    return Array.from(cargoDataMap.values()).sort((a, b) => a.cargo.localeCompare(b.cargo));
  };

  if (!sindicato.cargos || sindicato.cargos.length === 0) return null;

  return (
    <Collapsible 
      open={expandedCargos[sindicato.id]} 
      onOpenChange={() => toggleCargos(sindicato.id)}
    >
      <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium hover:text-primary w-full text-left py-2">
        <ChevronRight className={cn(
          "h-4 w-4 transition-transform",
          expandedCargos[sindicato.id] && "transform rotate-90"
        )} />
        Cargos e Remuneração ({sindicato.cargos.length})
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2">
        <div className="space-y-3">
          {prepareCargoData(sindicato).map((cargoData) => (
            <CargoDetalhes key={cargoData.id} cargoData={cargoData} />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
