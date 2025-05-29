
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { BeneficioData, AnotacaoData } from "@/types/sindicatos";

interface BeneficiosSectionProps {
  beneficios: BeneficioData[];
  anotacoes: AnotacaoData[];
}

export function BeneficiosSection({ beneficios, anotacoes }: BeneficiosSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Agrupar benefícios por coluna (fonte_coluna) e sugestao_particularidade das anotações
  const groupedBeneficios = beneficios.reduce((acc, beneficio) => {
    // Buscar anotação correspondente para obter sugestao_particularidade
    const anotacao = anotacoes.find(a => a.coluna === beneficio.fonte_coluna);
    const groupKey = anotacao?.sugestao_particularidade || beneficio.fonte_coluna || 'Outros';
    
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(beneficio);
    return acc;
  }, {} as Record<string, BeneficioData[]>);

  const totalBeneficios = beneficios.length;

  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-muted/50 rounded">
        <h4 className="font-medium text-sm text-accent-foreground">Benefícios ({totalBeneficios})</h4>
        <ChevronDown className={cn(
          "h-4 w-4 transition-transform",
          isExpanded && "transform rotate-180"
        )} />
      </CollapsibleTrigger>
      
      <CollapsibleContent className="space-y-3 mt-2">
        {Object.entries(groupedBeneficios).map(([subdivision, beneficiosList]) => (
          <div key={subdivision} className="bg-muted/20 p-3 rounded border">
            <div className="font-medium text-sm mb-2">{subdivision}</div>
            <div className="space-y-2">
              {beneficiosList
                .sort((a, b) => (a.registro_idx || 0) - (b.registro_idx || 0))
                .map((beneficio, i) => (
                <div key={i} className="bg-green-100 text-green-800 p-2 rounded text-xs">
                  <div className="font-medium">{beneficio.descricao || beneficio.nome}</div>
                  <div className="text-sm mt-1">{beneficio.valor || '-'}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
