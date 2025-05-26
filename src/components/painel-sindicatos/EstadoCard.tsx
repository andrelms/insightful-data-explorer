
import { MapPin, ChevronDown, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { EstadoSindicatos, CargoData, ParticularidadeData } from '@/types/sindicatos';
import { PisoSalariaisTable } from './PisoSalariaisTable';
import { ValoresHoraTable } from './ValoresHoraTable';
import { BeneficiosTable } from './BeneficiosTable';

interface EstadoCardProps {
  estado: EstadoSindicatos;
  expandedSindicatos: Record<string, boolean>;
  toggleSindicato: (estadoSigla: string, sindicatoIndex: number) => void;
}

export const EstadoCard = ({ estado, expandedSindicatos, toggleSindicato }: EstadoCardProps) => {
  // Agrupar particularidades por categoria
  const agruparParticularidades = (particularidades: ParticularidadeData[]) => {
    const grupos: Record<string, ParticularidadeData[]> = {};
    
    particularidades.forEach(part => {
      const categoria = part.categoria || 'Geral';
      if (!grupos[categoria]) {
        grupos[categoria] = [];
      }
      grupos[categoria].push(part);
    });
    
    return grupos;
  };

  return (
    <div className="estado-card fade-in" data-estado={estado.sigla.toLowerCase()}>
      <Card className="overflow-hidden hover-scale h-full">
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
                  className="p-4 cursor-pointer hover:bg-muted/50 flex justify-between items-center"
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
                    
                    {/* Informações do Sindicato */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-xs text-accent-foreground">Informações do Sindicato</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {sindicato.data_base && (
                          <div className="bg-muted/30 p-2 rounded border-l-2 border-primary">
                            <div className="text-xs font-medium">Data Base</div>
                            <div>{sindicato.data_base}</div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Cargos e Pisos Salariais */}
                    {sindicato.cargos && sindicato.cargos.length > 0 && (
                      <PisoSalariaisTable cargos={sindicato.cargos} />
                    )}

                    {/* Valores Hora */}
                    {sindicato.cargos.some(c => c.valores_hora.length > 0) && (
                      <ValoresHoraTable cargos={sindicato.cargos} />
                    )}

                    {/* Benefícios */}
                    {sindicato.beneficios && sindicato.beneficios.length > 0 && (
                      <BeneficiosTable beneficios={sindicato.beneficios} />
                    )}

                    {/* Particularidades agrupadas por categoria */}
                    {sindicato.particularidades && sindicato.particularidades.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-xs text-accent-foreground">Particularidades</h4>
                        <div className="space-y-3">
                          {Object.entries(agruparParticularidades(sindicato.particularidades)).map(([categoria, items]) => (
                            <Collapsible key={categoria}>
                              <CollapsibleTrigger className="flex items-center justify-between w-full p-2 bg-muted/30 rounded border-l-2 border-orange-500 hover:bg-muted/50">
                                <span className="text-xs font-medium">{categoria}</span>
                                <ChevronDown className="h-3 w-3" />
                              </CollapsibleTrigger>
                              <CollapsibleContent className="mt-1 space-y-1">
                                {items.map((item, i) => (
                                  <div key={i} className="ml-4 p-2 bg-muted/20 rounded text-xs">
                                    {item.conteudo}
                                  </div>
                                ))}
                              </CollapsibleContent>
                            </Collapsible>
                          ))}
                        </div>
                      </div>
                    )}
                    
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
    </div>
  );
};
