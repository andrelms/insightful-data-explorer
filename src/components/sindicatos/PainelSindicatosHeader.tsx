
interface PainelSindicatosHeaderProps {}

export function PainelSindicatosHeader({}: PainelSindicatosHeaderProps) {
  return (
    <div className="text-center space-y-2">
      <h1 className="text-3xl font-bold">Painel de Sindicatos</h1>
      <p className="text-muted-foreground">
        Explore informações detalhadas sobre sindicatos e convenções coletivas
      </p>
    </div>
  );
}
