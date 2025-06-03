
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ParticularidadeData, AnotacaoData } from "@/types/sindicatos";

interface ParticularidadesSectionProps {
  particularidades: ParticularidadeData[];
  anotacoes: AnotacaoData[];
}

export function ParticularidadesSection({ particularidades, anotacoes }: ParticularidadesSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Função para obter campo_formatado da anotação pelo registro_idx
  const getCampoFormatado = (registroIdx: number | null) => {
    if (!registroIdx) return null;
    const anotacao = anotacoes.find(a => a.registro_idx === registroIdx);
    return anotacao?.campo_formatado || null;
  };

  const particularidadesComDetalhe = particularidades
    .filter(part => part.detalhe) // Mostrar apenas se tem detalhe
    .sort((a, b) => (a.registro_idx || 0) - (b.registro_idx || 0));

  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-muted/50 rounded">
        <h4 className="font-medium text-sm text-accent-foreground">Particularidades ({particularidadesComDetalhe.length})</h4>
        <ChevronDown className={cn(
          "h-4 w-4 transition-transform",
          isExpanded && "transform rotate-180"
        )} />
      </CollapsibleTrigger>
      
      <CollapsibleContent className="space-y-2 mt-2">
        {particularidadesComDetalhe.map((part, i) => {
          const campoFormatado = getCampoFormatado(part.registro_idx);
          
          return (
            <div key={i} className="bg-orange-100 text-orange-800 p-2 rounded text-xs">
              <div className="font-medium mb-1">{part.detalhe}</div>
              {campoFormatado && (
                <div className="text-xs mb-1 p-1 bg-orange-50 border border-orange-200 rounded">
                  {campoFormatado}
                </div>
              )}
              {part.conteudo && (
                <div className="text-xs">{part.conteudo}</div>
              )}
            </div>
          );
        })}
      </CollapsibleContent>
    </Collapsible>
  );
}
