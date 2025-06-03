
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { SindicatoData } from "./types";

interface SindicatoParticularidadesProps {
  sindicato: SindicatoData;
}

export function SindicatoParticularidades({ sindicato }: SindicatoParticularidadesProps) {
  const [expandedParticularidades, setExpandedParticularidades] = useState<Record<string, boolean>>({});

  const toggleParticularidades = (sindicatoId: string) => {
    setExpandedParticularidades(prev => ({
      ...prev,
      [sindicatoId]: !prev[sindicatoId]
    }));
  };

  if (!sindicato.particularidades || sindicato.particularidades.length === 0) return null;

  return (
    <Collapsible 
      open={expandedParticularidades[sindicato.id]} 
      onOpenChange={() => toggleParticularidades(sindicato.id)}
    >
      <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium hover:text-primary w-full text-left py-2">
        <ChevronRight className={cn(
          "h-4 w-4 transition-transform",
          expandedParticularidades[sindicato.id] && "transform rotate-90"
        )} />
        Particularidades ({sindicato.particularidades.length})
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2">
        <div className="space-y-2">
          {sindicato.particularidades
            .sort((a, b) => (a.registro_idx || 0) - (b.registro_idx || 0))
            .map((part, i) => (
            <div key={i} className="bg-orange-100 text-orange-800 p-2 rounded text-xs">
              {part.conteudo || part.detalhe}
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
