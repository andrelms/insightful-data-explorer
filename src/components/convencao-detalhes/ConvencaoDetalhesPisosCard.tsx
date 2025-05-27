
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PisoSalarial {
  id: string;
  cargo: string;
  carga_horaria: string | null;
  piso_salarial: number | null;
  valor_hora_normal: number | null;
  valor_hora_extra_50: number | null;
  valor_hora_extra_100: number | null;
  piso_descricao?: string | null;
}

interface ConvencaoDetalhesPisosCardProps {
  pisosSalariais: PisoSalarial[];
}

export function ConvencaoDetalhesPisosCard({ pisosSalariais }: ConvencaoDetalhesPisosCardProps) {
  const formatCurrency = (value: number | null) => {
    if (!value) return 'N/A';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Criar colunas dinâmicas para pisos salariais baseadas nas descrições
  const criarColunasPisosSalariais = (pisos: PisoSalarial[]) => {
    const descricoesUnicas = new Set<string>();
    pisos.forEach(piso => {
      if (piso.piso_descricao) {
        descricoesUnicas.add(piso.piso_descricao);
      }
    });
    return Array.from(descricoesUnicas);
  };

  const descricoesUnicas = criarColunasPisosSalariais(pisosSalariais);

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-base">Cargos e Pisos Salariais</CardTitle>
      </CardHeader>
      <CardContent>
        {pisosSalariais.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr>
                  <th className="p-2 border bg-muted text-xs uppercase">Cargo</th>
                  <th className="p-2 border bg-muted text-xs uppercase">Carga Horária</th>
                  {descricoesUnicas.length === 0 && (
                    <th className="p-2 border bg-muted text-xs uppercase">Piso Salarial</th>
                  )}
                  {descricoesUnicas.map(desc => (
                    <th key={desc} className="p-2 border bg-muted text-xs uppercase">{desc}</th>
                  ))}
                  <th className="p-2 border bg-muted text-xs uppercase">Hora Normal</th>
                  <th className="p-2 border bg-muted text-xs uppercase">Hora Extra 50%</th>
                  <th className="p-2 border bg-muted text-xs uppercase">Hora Extra 100%</th>
                </tr>
              </thead>
              <tbody>
                {pisosSalariais.map((piso, i) => (
                  <tr key={i} className="even:bg-muted/30">
                    <td className="p-2 border">{piso.cargo}</td>
                    <td className="p-2 border">{piso.carga_horaria || '-'}</td>
                    {descricoesUnicas.length === 0 && (
                      <td className="p-2 border">
                        {formatCurrency(piso.piso_salarial)}
                      </td>
                    )}
                    {descricoesUnicas.map(desc => (
                      <td key={desc} className="p-2 border">
                        {piso.piso_descricao === desc ? formatCurrency(piso.piso_salarial) : '-'}
                      </td>
                    ))}
                    <td className="p-2 border">{formatCurrency(piso.valor_hora_normal)}</td>
                    <td className="p-2 border">{formatCurrency(piso.valor_hora_extra_50)}</td>
                    <td className="p-2 border">{formatCurrency(piso.valor_hora_extra_100)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-4">Nenhum piso salarial registrado.</p>
        )}
      </CardContent>
    </Card>
  );
}
