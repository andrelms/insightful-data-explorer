
import { useState } from "react";
import { Search } from "lucide-react";
import { useSindicatosData } from "@/hooks/useSindicatosData";
import { SearchFilters } from "@/components/sindicatos/SearchFilters";
import { EstadoCard } from "@/components/sindicatos/EstadoCard";

const PainelSindicatos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("all");
  const [categoriaFilter, setCategoriaFilter] = useState("all");
  const { dados, loading } = useSindicatosData();

  // Filter and search logic
  const filteredEstados = dados.filter(estado => {
    if (estadoFilter !== "all" && estado.sigla !== estadoFilter) return false;
    
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
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Painel de Sindicatos</h1>
        <p className="text-muted-foreground">
          Informações atualizadas e comparativas sobre sindicatos e convenções coletivas.
        </p>
      </div>
      
      <SearchFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        estadoFilter={estadoFilter}
        onEstadoChange={setEstadoFilter}
        categoriaFilter={categoriaFilter}
        onCategoriaChange={setCategoriaFilter}
      />
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid gap-6" style={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '1.5rem'
        }}>
          <style>{`
            @media (max-width: 768px) {
              .grid {
                grid-template-columns: 1fr !important;
              }
            }
          `}</style>
          {filteredEstados.map((estado) => (
            <EstadoCard key={estado.sigla} estado={estado} />
          ))}
          
          {filteredEstados.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
              <div className="rounded-full bg-muted/40 p-4 mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-medium mb-1">Nenhum resultado encontrado</h3>
              <p className="text-muted-foreground max-w-md">
                Não encontramos resultados para sua busca. Tente outros termos ou remova os filtros.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PainelSindicatos;
