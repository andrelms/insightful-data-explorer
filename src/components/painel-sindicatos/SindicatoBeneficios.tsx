
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

  const getBeneficiosFromAnotacoes = () => {
    if (!sindicato.anotacoes) return [];
    
    return sindicato.anotacoes
      .filter(anotacao => 
        anotacao.coluna && 
        !['PARTICULARIDADE', 'DATA BASE', 'SITE'].includes(anotacao.coluna.toUpperCase())
      )
      .map(anotacao => ({
        coluna: anotacao.coluna,
        sugestao_particularidade: anotacao.sugestao_particularidade,
        campo_formatado: anotacao.campo_formatado,
        registro_idx: anotacao.registro_idx
      }))
      .sort((a, b) => (a.registro_idx || 0) - (b.registro_idx || 0));
  };

  const getParticularidades = () => {
    const particularidadesFromAnotacoes = sindicato.anotacoes?.filter(anotacao =>
      anotacao.coluna?.toUpperCase() === 'PARTICULARIDADE'
    ) || [];

    const particularidadesFromTable = sindicato.particularidades || [];

    return [...particularidadesFromAnotacoes, ...particularidadesFromTable]
      .sort((a, b) => (a.registro_idx || 0) - (b.registro_idx || 0));
  };

  const beneficiosData = getBeneficiosFromAnotacoes();
  const particularidadesData = getParticularidades();

  if (beneficiosData.length === 0 && particularidadesData.length === 0) return null;

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
        Benefícios ({beneficiosData.length + particularidadesData.length})
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2">
        <div className="space-y-3">
          {/* Benefícios das anotações */}
          {beneficiosData.map((beneficio, i) => (
            <div key={`beneficio-${i}`} className="bg-green-100 text-green-800 p-3 rounded-lg border-l-4 border-green-500">
              <div className="font-semibold text-sm mb-1">{beneficio.coluna}</div>
              {beneficio.sugestao_particularidade && (
                <div className="text-xs font-medium text-green-700 mb-1">
                  {beneficio.sugestao_particularidade}
                </div>
              )}
              <div className="text-xs">
                {beneficio.campo_formatado}
              </div>
            </div>
          ))}
          
          {/* Particularidades */}
          {particularidadesData.length > 0 && (
            <div className="bg-orange-100 text-orange-800 p-3 rounded-lg border-l-4 border-orange-500">
              <div className="font-semibold text-sm mb-2">PARTICULARIDADE</div>
              <div className="space-y-1">
                {particularidadesData.map((part, i) => (
                  <div key={`part-${i}`} className="text-xs">
                    {part.campo_formatado || part.conteudo}
                    {part.detalhe && (
                      <div className="mt-1 text-orange-700">
                        {part.detalhe}
                      </div>
                    )}
                    {part.conteudo && part.campo_formatado && (
                      <div className="mt-1 text-orange-700">
                        {part.conteudo}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
