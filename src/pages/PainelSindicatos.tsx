
import { Search } from "lucide-react";
import { PainelSindicatosHeader } from "@/components/painel-sindicatos/PainelSindicatosHeader";
import { SindicatoCard } from "@/components/painel-sindicatos/SindicatoCard";
import { usePainelSindicatos } from "@/components/painel-sindicatos/usePainelSindicatos";

const PainelSindicatos = () => {
  const {
    searchTerm,
    setSearchTerm,
    estadoFilter,
    setEstadoFilter,
    categoriaFilter,
    setCategoriaFilter,
    loading,
    filteredEstados,
    siglas_estados
  } = usePainelSindicatos();
  
  return (
    <div className="space-y-6 animate-fade-in">
      <PainelSindicatosHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        estadoFilter={estadoFilter}
        setEstadoFilter={setEstadoFilter}
        categoriaFilter={categoriaFilter}
        setCategoriaFilter={setCategoriaFilter}
        siglas_estados={siglas_estados}
      />
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredEstados.map((estado) => (
            <SindicatoCard key={estado.sigla} estado={estado} />
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
