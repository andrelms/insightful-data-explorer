
import { BeneficioData } from "@/types/sindicatos";

interface BeneficiosSectionProps {
  beneficiosGrouped: {[key: string]: BeneficioData[]};
}

export function BeneficiosSection({ beneficiosGrouped }: BeneficiosSectionProps) {
  return (
    <div className="space-y-2">
      <h4 className="font-medium text-xs text-accent-foreground">Benefícios</h4>
      <div className="space-y-3">
        {Object.entries(beneficiosGrouped).map(([sugestao, beneficios]) => (
          <div key={sugestao} className="bg-muted/20 p-3 rounded border">
            <div className="font-medium text-sm mb-2">{sugestao}</div>
            <div className="space-y-1">
              {beneficios
                .sort((a, b) => (a.registro_idx || 0) - (b.registro_idx || 0))
                .map((beneficio, i) => (
                <div key={i} className="bg-green-100 text-green-800 p-2 rounded text-xs">
                  <div className="font-medium">{beneficio.descricao || beneficio.nome}</div>
                  <div>{beneficio.valor || '-'}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
