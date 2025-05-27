
import { useState } from "react";
import { PainelHeader } from "@/components/painel-sindicatos/PainelHeader";
import { EstadoCard } from "@/components/painel-sindicatos/EstadoCard";
import { EmptyState } from "@/components/painel-sindicatos/EmptyState";
import { useSindicatosData } from "@/hooks/useSindicatosData";

const PainelSindicatos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("all");
  const [categoriaFilter, setCategoriaFilter] = useState("all");
  const [expandedSindicatos, setExpandedSindicatos] = useState<Record<string, boolean>>({});
  
  const { dados, loading } = useSindicatosData();

  // Filter and search logic
  const filteredEstados = dados.filter(estado => {
    // Estado filter logic
    if (estadoFilter !== "all" && estado.sigla !== estadoFilter) return false;
    
    // Search term logic
    if (searchTerm) {
      const termLower = searchTerm.toLowerCase();
      const estadoMatches = estado.nome.toLowerCase().includes(termLower);
      const sindicatoMatches = estado.sindicatos.some(sind => 
        sind.nome.toLowerCase().includes(termLower) || 
        sind.cargos.some(cargo => 
          cargo.cargo.toLowerCase().includes(termLower) ||
          cargo.carga_horaria?.toLowerCase().includes(termLower)
        )
      );
      
      return estadoMatches || sindicatoMatches;
    }
    
    return true;
  });
  
  const toggleSindicato = (estadoSigla: string, sindicatoIndex: number) => {
    const key = `${estadoSigla}-${sindicatoIndex}`;
    setExpandedSindicatos(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Determinar quantas colunas usar baseado no filtro
  const getGridCols = () => {
    if (estadoFilter !== "all") {
      return "grid-cols-1"; // Uma coluna quando filtrado para expandir
    }
    return "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"; // Layout normal
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <PainelHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        estadoFilter={estadoFilter}
        setEstadoFilter={setEstadoFilter}
        categoriaFilter={categoriaFilter}
        setCategoriaFilter={setCategoriaFilter}
      />
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className={`grid ${getGridCols()} gap-6`}>
          {filteredEstados.map((estado) => (
            <EstadoCard
              key={estado.sigla}
              estado={estado}
              expandedSindicatos={expandedSindicatos}
              toggleSindicato={toggleSindicato}
            />
          ))}
          
          {filteredEstados.length === 0 && <EmptyState />}
        </div>
      )}
    </div>
  );
};

export default PainelSindicatos;
