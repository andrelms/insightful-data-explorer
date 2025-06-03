
interface PainelSindicatosEmptyStateProps {}

export function PainelSindicatosEmptyState({}: PainelSindicatosEmptyStateProps) {
  return (
    <div className="text-center py-12">
      <h3 className="text-lg font-medium text-muted-foreground mb-2">
        Nenhum resultado encontrado
      </h3>
      <p className="text-sm text-muted-foreground">
        Tente ajustar os filtros ou termo de busca
      </p>
    </div>
  );
}
