
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

  const getParticularidadesGrouped = () => {
    // Pegar particularidades da tabela particularidades
    const particularidadesFromTable = sindicato.particularidades || [];

    // Filtrar apenas itens que têm conteúdo válido nos campos detalhe ou conteudo
    const particularidadesValidas = particularidadesFromTable.filter(part => {
      const temDetalhe = part.detalhe && part.detalhe.trim() !== '';
      const temConteudo = part.conteudo && part.conteudo.trim() !== '';
      return temDetalhe || temConteudo;
    });

    // Pegar também anotações que podem ter sugestao_particularidade
    const anotacoes = sindicato.anotacoes || [];
    const anotacoesComSugestao = anotacoes.filter(anotacao => 
      anotacao.sugestao_particularidade && 
      anotacao.sugestao_particularidade.trim() !== '' &&
      anotacao.campo_formatado &&
      anotacao.campo_formatado.trim() !== ''
    );

    // Agrupar por campo_formatado
    const grupos: Record<string, {
      campo_formatado: string;
      particularidades: typeof particularidadesValidas;
      sugestoes: typeof anotacoesComSugestao;
    }> = {};

    // Adicionar particularidades aos grupos
    particularidadesValidas.forEach(part => {
      const key = part.campo_formatado || 'sem_grupo';
      if (!grupos[key]) {
        grupos[key] = {
          campo_formatado: part.campo_formatado || '',
          particularidades: [],
          sugestoes: []
        };
      }
      grupos[key].particularidades.push(part);
    });

    // Adicionar sugestões aos grupos correspondentes
    anotacoesComSugestao.forEach(anotacao => {
      const key = anotacao.campo_formatado || 'sem_grupo';
      if (!grupos[key]) {
        grupos[key] = {
          campo_formatado: anotacao.campo_formatado || '',
          particularidades: [],
          sugestoes: []
        };
      }
      grupos[key].sugestoes.push(anotacao);
    });

    // Converter para array e ordenar
    return Object.values(grupos)
      .filter(grupo => grupo.particularidades.length > 0 || grupo.sugestoes.length > 0)
      .sort((a, b) => {
        const aIdx = Math.min(
          ...a.particularidades.map(p => p.registro_idx || 0),
          ...a.sugestoes.map(s => s.registro_idx || 0)
        );
        const bIdx = Math.min(
          ...b.particularidades.map(p => p.registro_idx || 0),
          ...b.sugestoes.map(s => s.registro_idx || 0)
        );
        return aIdx - bIdx;
      });
  };

  const gruposData = getParticularidadesGrouped();

  if (gruposData.length === 0) return null;

  const totalItems = gruposData.reduce((acc, grupo) => acc + grupo.particularidades.length + grupo.sugestoes.length, 0);

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
                  <div key={`part-${i}`} className="bg-orange-100 text-orange-800 p-3 rounded-lg">
                    {part.detalhe && part.detalhe.trim() !== '' && (
                      <div className="font-semibold text-orange-900 mb-2">
                        {part.detalhe}
                      </div>
                    )}
                    {part.conteudo && part.conteudo.trim() !== '' && (
                      <div className="text-orange-700 text-sm">
                        {part.conteudo}
                      </div>
                    )}
                  </div>
                ))}

              {/* Sugestões de particularidades do grupo */}
              {grupo.sugestoes
                .sort((a, b) => (a.registro_idx || 0) - (b.registro_idx || 0))
                .map((sugestao, i) => (
                  <div key={`sug-${i}`} className="bg-blue-100 text-blue-800 p-3 rounded-lg border-l-4 border-blue-500">
                    <div className="font-semibold text-blue-900 mb-1 text-sm">
                      Sugestão de Particularidade
                    </div>
                    <div className="text-blue-700 text-sm">
                      {sugestao.sugestao_particularidade}
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
