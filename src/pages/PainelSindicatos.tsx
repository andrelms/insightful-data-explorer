
import { useSindicatosData } from "@/hooks/useSindicatosData";
import { EstadoCard } from "@/components/sindicatos/EstadoCard";
import { SearchFilters } from "@/components/sindicatos/SearchFilters";
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
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Painel de Sindicatos</h1>
        <p className="text-muted-foreground">
          Explore informações detalhadas sobre sindicatos e convenções coletivas
        </p>
      </div>

      <SearchFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedEstado={selectedEstado}
        setSelectedEstado={setSelectedEstado}
        estados={dados}
      />

      {filteredDados.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            Nenhum resultado encontrado
          </h3>
          <p className="text-sm text-muted-foreground">
            Tente ajustar os filtros ou termo de busca
          </p>
        </div>
      ) : (
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
      )}
    </div>
  );
}
