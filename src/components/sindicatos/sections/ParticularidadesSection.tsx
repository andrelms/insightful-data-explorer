
import { ParticularidadeData } from "@/types/sindicatos";

interface ParticularidadesSectionProps {
  particularidades: ParticularidadeData[];
}

export function ParticularidadesSection({ particularidades }: ParticularidadesSectionProps) {
  return (
    <div className="space-y-2">
      <h4 className="font-medium text-xs text-accent-foreground">Particularidades</h4>
      <div className="space-y-2">
        {particularidades
          .filter(part => part.detalhe) // Mostrar apenas se tem detalhe
          .sort((a, b) => (a.registro_idx || 0) - (b.registro_idx || 0))
          .map((part, i) => (
            <div key={i} className="bg-orange-100 text-orange-800 p-2 rounded text-xs">
              <div className="font-medium mb-1">{part.detalhe}</div>
              {part.conteudo && (
                <div>{part.conteudo}</div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
