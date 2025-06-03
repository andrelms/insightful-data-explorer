
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
    <div className="estado-card fade-in w-full" data-estado={estado.sigla.toLowerCase()}>
      <Card className="overflow-hidden hover-scale h-full flex flex-col rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-slate-200 dark:border-slate-700">
        <div className="bg-gradient-to-r from-blue-600 to-violet-600 text-white p-6 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-full">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{estado.nome}</h2>
              <div className="text-sm opacity-90 mt-1">
                {estado.sindicatos.length} Sindicato{estado.sindicatos.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </div>
        
        <CardContent className="p-0 flex-1 rounded-b-3xl overflow-hidden">
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
