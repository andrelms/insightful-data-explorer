
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { SindicatoData, BeneficioData } from "./types";

interface SindicatoBeneficiosProps {
  sindicato: SindicatoData;
}

export function SindicatoBeneficios({ sindicato }: SindicatoBeneficiosProps) {
  const [expandedBeneficios, setExpandedBeneficios] = useState<Record<string, boolean>>({});

  const toggleBeneficios = (sindicatoId: string) => {
    setExpandedBeneficios(prev => ({
      ...prev,
      [sindicatoId]: !prev[sindicatoId]
    }));
  };

  const groupBeneficiosByColuna = (beneficios: BeneficioData[]) => {
    const grouped: {[key: string]: BeneficioData[]} = {};
    
    beneficios.forEach(beneficio => {
      const coluna = beneficio.coluna || 'Outros';
      if (!grouped[coluna]) {
        grouped[coluna] = [];
      }
      grouped[coluna].push(beneficio);
    });
    
    return grouped;
  };

  if (!sindicato.beneficios || sindicato.beneficios.length === 0) return null;

  return (
    <Collapsible 
      open={expandedBeneficios[sindicato.id]} 
      onOpenChange={() => toggleBeneficios(sindicato.id)}
    >
      <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium hover:text-primary w-full text-left py-2">
        <ChevronRight className={cn(
          "h-4 w-4 transition-transform",
          expandedBeneficios[sindicato.id] && "transform rotate-90"
        )} />
        Benefícios ({sindicato.beneficios.length})
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2">
        <div className="grid grid-cols-1 gap-3">
          {Object.entries(groupBeneficiosByColuna(sindicato.beneficios)).map(([coluna, beneficios]) => (
            <div key={coluna} className="bg-green-100 text-green-800 p-3 rounded-lg border-l-4 border-green-500">
              <div className="font-semibold text-sm mb-2">{coluna}</div>
              <div className="space-y-1">
                {beneficios
                  .sort((a, b) => (a.registro_idx || 0) - (b.registro_idx || 0))
                  .map((beneficio, i) => (
                  <div key={i} className="text-xs">
                    {beneficio.campo_formatado}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
