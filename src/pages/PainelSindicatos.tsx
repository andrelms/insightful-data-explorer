
import { useSindicatosData } from "@/hooks/useSindicatosData";
import { SearchFilters } from "@/components/sindicatos/SearchFilters";
import { PainelSindicatosHeader } from "@/components/sindicatos/PainelSindicatosHeader";
import { PainelSindicatosGrid } from "@/components/sindicatos/PainelSindicatosGrid";
import { PainelSindicatosEmptyState } from "@/components/sindicatos/PainelSindicatosEmptyState";
import { useState } from "react";

export default function PainelSindicatos() {
  const { dados, loading } = useSindicatosData();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEstado, setSelectedEstado] = useState("todos");

  // Filtrar dados
  const filteredDados = dados.filter(estado => {
    // Filtro por estado
    if (selectedEstado !== "todos" && selectedEstado !== "" && estado.sigla !== selectedEstado) {
      return false;
    }
    
    // Filtro por termo de busca
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      return estado.sindicatos.some(sindicato => 
        sindicato.nome.toLowerCase().includes(term) ||
        (sindicato.cnpj && sindicato.cnpj.toLowerCase().includes(term)) ||
        (sindicato.site && sindicato.site.toLowerCase().includes(term)) ||
        sindicato.cargos.some(cargo => cargo.cargo.toLowerCase().includes(term)) ||
        estado.nome.toLowerCase().includes(term) ||
        estado.sigla.toLowerCase().includes(term)
      );
    }
    
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 min-h-screen">
      <PainelSindicatosHeader />

      <SearchFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedEstado={selectedEstado}
        setSelectedEstado={setSelectedEstado}
        estados={dados}
      />

      {filteredDados.length === 0 ? (
        <PainelSindicatosEmptyState />
      ) : (
        <PainelSindicatosGrid filteredDados={filteredDados} />
      )}
    </div>
  );
}
