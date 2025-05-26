
import { BeneficioData } from '@/types/sindicatos';

interface BeneficiosTableProps {
  beneficios: BeneficioData[];
}

export const BeneficiosTable = ({ beneficios }: BeneficiosTableProps) => {
  return (
    <div className="space-y-2">
      <h4 className="font-medium text-xs text-accent-foreground">Benefícios</h4>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr>
              <th className="p-2 border bg-muted text-xs uppercase">Benefício</th>
              <th className="p-2 border bg-muted text-xs uppercase">Valor</th>
            </tr>
          </thead>
          <tbody>
            {beneficios.map((beneficio, i) => (
              <tr key={i} className="even:bg-muted/30">
                <td className="p-2 border">{beneficio.tipo || beneficio.nome}</td>
                <td className="p-2 border">{beneficio.valor || beneficio.descricao || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
