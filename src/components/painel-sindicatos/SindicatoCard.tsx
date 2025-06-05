
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, ChevronDown, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { SindicatoData } from "./types";
import { SindicatoInfo } from "./SindicatoInfo";
import { SindicatoCargos } from "./SindicatoCargos";
import { SindicatoBeneficios } from "./SindicatoBeneficios";
import { SindicatoParticularidades } from "./SindicatoParticularidades";

interface SindicatoCardProps {
  estado: {
    sigla: string;
    nome: string;
    sindicatos: SindicatoData[];
  };
}

export function SindicatoCard({ estado }: SindicatoCardProps) {
  const [expandedSindicatos, setExpandedSindicatos] = useState<Record<string, boolean>>({});

  const toggleSindicato = (estadoSigla: string, sindicatoIndex: number) => {
    const key = `${estadoSigla}-${sindicatoIndex}`;
    setExpandedSindicatos(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <Card className="overflow-hidden hover-scale h-full flex flex-col transition-all duration-200 hover:shadow-lg">
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
        {estado.sindicatos.map((sindicato, sindIdx) => {
          const isExpanded = expandedSindicatos[`${estado.sigla}-${sindIdx}`];
          
          return (
            <div key={sindIdx} className="border-t first:border-t-0">
              <div 
                className="p-4 cursor-pointer hover:bg-muted/50 flex justify-between items-center transition-colors"
                onClick={() => toggleSindicato(estado.sigla, sindIdx)}
              >
                <div className="font-medium text-primary">{sindicato.nome}</div>
                <ChevronDown className={cn(
                  "h-5 w-5 text-muted-foreground transition-transform",
                  isExpanded && "transform rotate-180"
                )} />
              </div>
              
              {isExpanded && (
                <div className="p-4 pt-0 space-y-4 text-sm">
                  {sindicato.cnpj && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <Info className="h-3 w-3" />
                      <span>CNPJ: {sindicato.cnpj}</span>
                    </div>
                  )}
                  
                  <SindicatoInfo sindicato={sindicato} />
                  <SindicatoCargos sindicato={sindicato} />
                  <SindicatoBeneficios sindicato={sindicato} />
                  <SindicatoParticularidades sindicato={sindicato} />
                  
                  <div className="pt-2 mt-4 border-t text-center">
                    <Button variant="link" size="sm" className="text-xs text-muted-foreground">
                      Ver detalhes da convenção
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
