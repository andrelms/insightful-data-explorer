
import { useState } from "react";
import { SindicatoData } from "@/types/sindicatos";
import { getInformacoesSindicato, prepareCargoData } from "@/utils/sindicatosUtils";
import { CargosSection } from "./sections/CargosSection";
import { BeneficiosSection } from "./sections/BeneficiosSection";
import { ParticularidadesSection } from "./sections/ParticularidadesSection";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SindicatoDetailsProps {
  sindicato: SindicatoData;
}

export function SindicatoDetails({ sindicato }: SindicatoDetailsProps) {
  const [infoExpanded, setInfoExpanded] = useState(true);

  return (
    <>
      {/* Informações do Sindicato - Colapsável */}
      <Collapsible open={infoExpanded} onOpenChange={setInfoExpanded}>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-muted/50 rounded">
          <h4 className="font-medium text-sm text-accent-foreground">Informações do Sindicato</h4>
          <ChevronDown className={cn(
            "h-4 w-4 transition-transform",
            infoExpanded && "transform rotate-180"
          )} />
        </CollapsibleTrigger>
        
        <CollapsibleContent className="mt-2">
          <div className="grid grid-cols-1 gap-2">
            {getInformacoesSindicato(sindicato).map((info, idx) => (
              <div key={idx} className="bg-muted/30 p-2 rounded border-l-2 border-primary">
                <div className="text-xs font-medium">{info.coluna}</div>
                <div className="truncate text-sm">{info.valor}</div>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Cargos e Remuneração */}
      {sindicato.cargos && sindicato.cargos.length > 0 && (
        <CargosSection cargoData={prepareCargoData(sindicato)} />
      )}

      {/* Benefícios */}
      {sindicato.beneficios && sindicato.beneficios.length > 0 && (
        <BeneficiosSection 
          beneficios={sindicato.beneficios}
          anotacoes={sindicato.anotacoes || []}
        />
      )}

      {/* Particularidades */}
      {sindicato.particularidades && sindicato.particularidades.length > 0 && (
        <ParticularidadesSection particularidades={sindicato.particularidades} />
      )}
    </>
  );
}
