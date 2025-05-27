
import { CargoData } from '@/types/sindicatos';

interface ValoresHoraTableProps {
  cargos: CargoData[];
}

export const ValoresHoraTable = ({ cargos }: ValoresHoraTableProps) => {
  const formatCurrency = (value: number | null) => {
    if (!value) return 'N/A';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Criar colunas dinâmicas para valores de hora baseadas nos tipos
  const criarColunasValoresHora = (cargos: CargoData[]) => {
    const tiposUnicos = new Set<string>();
    cargos.forEach(cargo => {
      cargo.valores_hora.forEach(vh => {
        if (vh.tipo) {
          tiposUnicos.add(vh.tipo);
        }
      });
    });
    return Array.from(tiposUnicos);
  };

  const tiposUnicos = criarColunasValoresHora(cargos);

  return (
    <div className="space-y-2">
      <h4 className="font-medium text-xs text-accent-foreground">Valores Hora</h4>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr>
              <th className="p-2 border bg-muted text-xs uppercase">Cargo</th>
              {tiposUnicos.map(tipo => (
                <th key={tipo} className="p-2 border bg-muted text-xs uppercase">{tipo}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cargos.map((cargo) => {
              if (cargo.valores_hora.length === 0) return null;
              
              return (
                <tr key={cargo.id} className="even:bg-muted/30">
                  <td className="p-2 border">{cargo.cargo}</td>
                  {tiposUnicos.map(tipo => {
                    const valorHora = cargo.valores_hora.find(v => v.tipo === tipo);
                    return (
                      <td key={tipo} className="p-2 border">
                        {valorHora ? formatCurrency(valorHora.valor) : '-'}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
