
import { useSindicatosData } from "@/hooks/useSindicatosData";
import { EstadoCard } from "@/components/sindicatos/EstadoCard";
import { SearchFilters } from "@/components/sindicatos/SearchFilters";
import { useState } from "react";

export default function PainelSindicatos() {
  const { dados, loading } = useSindicatosData();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEstado, setSelectedEstado] = useState("");

  // Filtrar dados
  const filteredDados = dados.filter(estado => {
    if (selectedEstado && estado.sigla !== selectedEstado) return false;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return estado.sindicatos.some(sindicato => 
        sindicato.nome.toLowerCase().includes(term) ||
        sindicato.cnpj?.toLowerCase().includes(term) ||
        sindicato.cargos.some(cargo => cargo.cargo.toLowerCase().includes(term))
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
    <div className="container mx-auto px-4 py-6 space-y-6">
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-fr">
          {filteredDados.map((estado, index) => (
            <EstadoCard key={estado.sigla} estado={estado} />
          ))}
        </div>
      )}
    </div>
  );
}
