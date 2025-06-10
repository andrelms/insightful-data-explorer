
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

  const getParticularidadesFromAnotacoes = () => {
    if (!sindicato.anotacoes) return [];
    
    return sindicato.anotacoes
      .filter(anotacao => 
        anotacao.sugestao_particularidade && 
        anotacao.sugestao_particularidade.trim() !== '' &&
        anotacao.campo_formatado &&
        anotacao.campo_formatado.trim() !== '' &&
        anotacao.coluna &&
        anotacao.coluna.toUpperCase() !== 'PARTICULARIDADE'
      )
      .map(anotacao => ({
        campo_formatado: anotacao.campo_formatado,
        sugestao_particularidade: anotacao.sugestao_particularidade,
        registro_idx: anotacao.registro_idx
      }))
      .sort((a, b) => (a.registro_idx || 0) - (b.registro_idx || 0));
  };

  const getParticularidadesGrouped = () => {
    const anotacoesComSugestao = getParticularidadesFromAnotacoes();

    // Agrupar por campo_formatado
    const grupos: Record<string, {
      campo_formatado: string;
      particularidades: typeof anotacoesComSugestao;
    }> = {};

    // Adicionar sugestões aos grupos
    anotacoesComSugestao.forEach(anotacao => {
      const key = anotacao.campo_formatado || 'sem_grupo';
      if (!grupos[key]) {
        grupos[key] = {
          campo_formatado: anotacao.campo_formatado || '',
          particularidades: []
        };
      }
      grupos[key].particularidades.push(anotacao);
    });

    // Converter para array e ordenar
    return Object.values(grupos)
      .filter(grupo => grupo.particularidades.length > 0)
      .sort((a, b) => {
        const aIdx = Math.min(...a.particularidades.map(p => p.registro_idx || 0));
        const bIdx = Math.min(...b.particularidades.map(p => p.registro_idx || 0));
        return aIdx - bIdx;
      });
  };

  const gruposData = getParticularidadesGrouped();

  if (gruposData.length === 0) return null;

  const totalItems = gruposData.reduce((acc, grupo) => acc + grupo.particularidades.length, 0);

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
        Particularidades ({totalItems})
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2">
        <div className="space-y-4">
          {gruposData.map((grupo, grupoIdx) => (
            <div key={grupoIdx} className="space-y-2">
              {/* Título do grupo baseado no campo_formatado */}
              {grupo.campo_formatado && (
                <div className="text-sm font-medium text-primary border-b pb-1">
                  {grupo.campo_formatado}
                </div>
              )}
              
              {/* Particularidades do grupo */}
              {grupo.particularidades
                .sort((a, b) => (a.registro_idx || 0) - (b.registro_idx || 0))
                .map((part, i) => (
                  <div key={`part-${i}`} className="bg-orange-100 text-orange-800 p-3 rounded-lg border-l-4 border-orange-500">
                    <div className="text-orange-700 text-sm">
                      {part.sugestao_particularidade}
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
