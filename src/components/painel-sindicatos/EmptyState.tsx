
import { Search } from 'lucide-react';

export const EmptyState = () => {
  return (
    <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
      <div className="rounded-full bg-muted/40 p-4 mb-4">
        <Search className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-medium mb-1">Nenhum resultado encontrado</h3>
      <p className="text-muted-foreground max-w-md">
        Não encontramos resultados para sua busca. Tente outros termos ou remova os filtros.
      </p>
    </div>
  );
};
