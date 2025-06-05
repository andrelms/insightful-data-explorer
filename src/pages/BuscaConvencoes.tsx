
import { SearchForm } from "@/components/busca-convencoes/SearchForm";
import { SearchResult } from "@/components/busca-convencoes/SearchResult";
import { SearchHistory } from "@/components/busca-convencoes/SearchHistory";
import { useBuscaConvencoes } from "@/hooks/useBuscaConvencoes";
import { Scope } from "@/types/busca-convencoes";

const BuscaConvencoes = () => {
  const {
    searching,
    processing,
    searchResults,
    currentResult,
    setCurrentResult,
    performSearch,
    startBatchProcessing
  } = useBuscaConvencoes();

  const handleStartProcessing = (resultId: string) => {
    startBatchProcessing(resultId, 'todos');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Busca de Convenções</h1>
        <p className="text-muted-foreground">
          Realize buscas inteligentes utilizando IA para encontrar informações sobre convenções coletivas
        </p>
      </div>

      {/* Formulário de Busca */}
      <SearchForm onSearch={performSearch} searching={searching} />

      {/* Resultado Atual */}
      {currentResult && (
        <SearchResult 
          result={currentResult}
          processing={processing}
          onStartProcessing={handleStartProcessing}
        />
      )}

      {/* Histórico de Buscas */}
      <SearchHistory 
        searchResults={searchResults}
        onSelectResult={setCurrentResult}
      />
    </div>
  );
};

export default BuscaConvencoes;
