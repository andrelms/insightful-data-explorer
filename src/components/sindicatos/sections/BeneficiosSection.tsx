
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

  // Agrupar benefícios por tipo (subcategorias)
  const beneficiosPorTipo = beneficios.reduce((acc, beneficio) => {
    const tipo = beneficio.tipo || 'Outros';
    
    if (!acc[tipo]) {
      acc[tipo] = [];
    }
    acc[tipo].push(beneficio);
    return acc;
  }, {} as Record<string, BeneficioData[]>);

  // Função para obter dados da anotação pelo registro_idx
  const getAnotacaoData = (registroIdx: number | null) => {
    if (!registroIdx) return null;
    const anotacao = anotacoes.find(a => a.registro_idx === registroIdx);
    return anotacao || null;
  };

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
        {Object.entries(beneficiosPorTipo).map(([tipo, beneficiosList]) => (
          <div key={tipo} className="bg-muted/20 p-3 rounded-lg border">
            <div className="font-medium text-sm mb-2 text-primary">{tipo}</div>
            <div className="space-y-2">
              {beneficiosList
                .sort((a, b) => (a.registro_idx || 0) - (b.registro_idx || 0))
                .map((beneficio, i) => {
                  const anotacaoData = getAnotacaoData(beneficio.registro_idx);
                  
                  return (
                    <div key={i} className="bg-green-50 text-green-800 p-3 rounded-lg border border-green-200">
                      {/* Nome/Descrição do benefício */}
                      <div className="font-medium text-sm mb-2">
                        {beneficio.nome || beneficio.descricao || 'Benefício'}
                      </div>
                      
                      {/* Sugestão de Particularidade da Anotação */}
                      {anotacaoData?.sugestao_particularidade && (
                        <div className="text-xs mb-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                          {anotacaoData.sugestao_particularidade}
                        </div>
                      )}
                      
                      {/* Campo Formatado da Anotação */}
                      {anotacaoData?.campo_formatado && (
                        <div className="text-xs mb-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                          {anotacaoData.campo_formatado}
                        </div>
                      )}
                      
                      {/* Valor do benefício */}
                      {beneficio.valor && (
                        <div className="text-sm font-semibold bg-green-100 p-2 rounded-lg border">
                          {beneficio.valor}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
