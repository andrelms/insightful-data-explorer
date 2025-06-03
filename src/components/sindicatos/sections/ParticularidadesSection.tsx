
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ParticularidadeData } from "@/types/sindicatos";

interface ParticularidadesSectionProps {
  particularidades: ParticularidadeData[];
}

export function ParticularidadesSection({ particularidades }: ParticularidadesSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const particularidadesComConteudo = particularidades
    .filter(part => part.conteudo) // Mostrar apenas se tem conteúdo
    .sort((a, b) => (a.registro_idx || 0) - (b.registro_idx || 0));

  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-muted/50 rounded">
        <h4 className="font-medium text-sm text-accent-foreground">Particularidades ({particularidadesComConteudo.length})</h4>
        <ChevronDown className={cn(
          "h-4 w-4 transition-transform",
          isExpanded && "transform rotate-180"
        )} />
      </CollapsibleTrigger>
      
      <CollapsibleContent className="space-y-2 mt-2">
        {particularidadesComConteudo.map((part, i) => (
          <div key={i} className="bg-orange-50 text-orange-800 p-3 rounded-lg border border-orange-200 text-sm">
            {part.conteudo}
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
