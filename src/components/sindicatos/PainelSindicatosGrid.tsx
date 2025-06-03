
import { EstadoCard } from "./EstadoCard";
import { EstadoSindicatos } from "@/types/sindicatos";

interface PainelSindicatosGridProps {
  filteredDados: EstadoSindicatos[];
}

export function PainelSindicatosGrid({ filteredDados }: PainelSindicatosGridProps) {
  return (
    <div className="w-full">
      {/* Grid responsivo que se adapta ao número de itens filtrados */}
      <div 
        className={`
          grid gap-6 w-full
          ${filteredDados.length === 1 ? 'grid-cols-1 max-w-4xl mx-auto' : ''}
          ${filteredDados.length === 2 ? 'grid-cols-1 lg:grid-cols-2 max-w-6xl mx-auto' : ''}
          ${filteredDados.length === 3 ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : ''}
          ${filteredDados.length >= 4 ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4' : ''}
        `}
      >
        {filteredDados.map((estado, index) => (
          <EstadoCard key={estado.sigla} estado={estado} />
        ))}
      </div>
    </div>
  );
}
