
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { EstadoSindicatos } from "@/types/sindicatos";
import { SindicatoCard } from "./SindicatoCard";

interface EstadoCardProps {
  estado: EstadoSindicatos;
}

export function EstadoCard({ estado }: EstadoCardProps) {
  const [expandedSindicatos, setExpandedSindicatos] = useState<Record<string, boolean>>({});

  const toggleSindicato = (sindicatoIndex: number) => {
    const key = `${estado.sigla}-${sindicatoIndex}`;
    setExpandedSindicatos(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="estado-card fade-in" data-estado={estado.sigla.toLowerCase()}>
      <Card className="overflow-hidden hover-scale h-full flex flex-col">
        <div className="bg-gradient-to-r from-blue-600 to-violet-600 text-white p-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            <h2 className="text-xl font-bold">{estado.nome}</h2>
          </div>
          <div className="text-sm opacity-80 mt-1">
            {estado.sindicatos.length} Sindicato{estado.sindicatos.length !== 1 ? 's' : ''}
          </div>
        </div>
        
        <CardContent className="p-0 flex-1">
          {estado.sindicatos.map((sindicato, sindIdx) => (
            <SindicatoCard
              key={sindIdx}
              sindicato={sindicato}
              sindIdx={sindIdx}
              estadoSigla={estado.sigla}
              isExpanded={expandedSindicatos[`${estado.sigla}-${sindIdx}`]}
              onToggle={() => toggleSindicato(sindIdx)}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
