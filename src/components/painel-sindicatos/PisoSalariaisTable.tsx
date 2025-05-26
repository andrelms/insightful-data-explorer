
import { CargoData } from '@/types/sindicatos';

interface PisoSalariaisTableProps {
  cargos: CargoData[];
}

export const PisoSalariaisTable = ({ cargos }: PisoSalariaisTableProps) => {
  const formatCurrency = (value: number | null) => {
    if (!value) return 'N/A';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Criar colunas dinâmicas para pisos salariais baseadas nas descrições
  const criarColunasPisosSalariais = (cargos: CargoData[]) => {
    const descricoesUnicas = new Set<string>();
    cargos.forEach(cargo => {
      if (cargo.piso_descricao) {
        descricoesUnicas.add(cargo.piso_descricao);
      }
    });
    return Array.from(descricoesUnicas);
  };

  const descricoesUnicas = criarColunasPisosSalariais(cargos);

  return (
    <div className="space-y-2">
      <h4 className="font-medium text-xs text-accent-foreground">Cargos e Pisos Salariais</h4>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[400px] border-collapse text-left">
          <thead>
            <tr>
              <th className="p-2 border bg-muted text-xs uppercase">Cargo</th>
              <th className="p-2 border bg-muted text-xs uppercase">Carga Horária</th>
              <th className="p-2 border bg-muted text-xs uppercase">Piso Salarial</th>
              {descricoesUnicas.map(desc => (
                <th key={desc} className="p-2 border bg-muted text-xs uppercase">{desc}</th>
              ))}
              {cargos.some(cargo => cargo.cbo) && (
                <th className="p-2 border bg-muted text-xs uppercase">CBO</th>
              )}
            </tr>
          </thead>
          <tbody>
            {cargos.map((cargo, i) => (
              <tr key={i} className="even:bg-muted/30">
                <td className="p-2 border">{cargo.cargo}</td>
                <td className="p-2 border">{cargo.carga_horaria || '-'}</td>
                <td className="p-2 border">
                  {!cargo.piso_descricao ? formatCurrency(cargo.piso_salarial) : '-'}
                </td>
                {descricoesUnicas.map(desc => (
                  <td key={desc} className="p-2 border">
                    {cargo.piso_descricao === desc ? formatCurrency(cargo.piso_salarial) : '-'}
                  </td>
                ))}
                {cargos.some(cargo => cargo.cbo) && (
                  <td className="p-2 border">{cargo.cbo || '-'}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
