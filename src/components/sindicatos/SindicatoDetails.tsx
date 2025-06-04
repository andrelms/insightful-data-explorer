
import { useState } from "react";
import { SindicatoData } from "@/types/sindicatos";
import { getInformacoesSindicato, prepareCargoData, groupBeneficiosBySugestao } from "@/utils/sindicatosUtils";
import { CargosSection } from "./sections/CargosSection";
import { BeneficiosSection } from "./sections/BeneficiosSection";
import { ParticularidadesSection } from "./sections/ParticularidadesSection";

interface SindicatoDetailsProps {
  sindicato: SindicatoData;
}

export function SindicatoDetails({ sindicato }: SindicatoDetailsProps) {
  const [expandedValoresHora, setExpandedValoresHora] = useState<Record<string, boolean>>({});

  const toggleValoresHora = (cargoId: string) => {
    setExpandedValoresHora(prev => ({
      ...prev,
      [cargoId]: !prev[cargoId]
    }));
  };

  return (
    <>
      {/* Informações do Sindicato */}
      <div className="space-y-2">
        <h4 className="font-medium text-xs text-accent-foreground">Informações do Sindicato</h4>
        <div className="grid grid-cols-1 gap-2">
          {getInformacoesSindicato(sindicato).map((info, idx) => (
            <div key={idx} className="bg-muted/30 p-2 rounded border-l-2 border-primary">
              <div className="text-xs font-medium">{info.coluna}</div>
              <div className="truncate">{info.valor}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Cargos e Remuneração */}
      {sindicato.cargos && sindicato.cargos.length > 0 && (
        <CargosSection 
          cargoData={prepareCargoData(sindicato)}
          expandedValoresHora={expandedValoresHora}
          onToggleValoresHora={toggleValoresHora}
        />
      )}

      {/* Benefícios Agrupados por Sugestão de Particularidade */}
      {sindicato.beneficios && sindicato.beneficios.length > 0 && (
        <BeneficiosSection 
          beneficiosGrouped={groupBeneficiosBySugestao(sindicato.beneficios, sindicato.anotacoes)}
        />
      )}

      {/* Particularidades usando campo detalhe */}
      {sindicato.particularidades && sindicato.particularidades.length > 0 && (
        <ParticularidadesSection particularidades={sindicato.particularidades} />
      )}
    </>
  );
}
