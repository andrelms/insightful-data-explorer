
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardTable } from "@/components/dashboard/DashboardTable";

interface Beneficio {
  id: string;
  tipo: string;
  valor: string | null;
  descricao: string | null;
}

interface ConvencaoDetalhesBeneficiosCardProps {
  beneficios: Beneficio[];
  valeRefeicao: string | null;
  valeRefeicaoValor: number | null;
  assistenciaMedica: boolean | null;
  seguroVida: boolean | null;
  uniforme: boolean | null;
  adicionalNoturno: string | null;
}

export function ConvencaoDetalhesBeneficiosCard({
  beneficios,
  valeRefeicao,
  valeRefeicaoValor,
  assistenciaMedica,
  seguroVida,
  uniforme,
  adicionalNoturno
}: ConvencaoDetalhesBeneficiosCardProps) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-base">Benefícios</CardTitle>
      </CardHeader>
      <CardContent>
        {beneficios.length > 0 ? (
          <DashboardTable 
            columns={["Tipo", "Valor", "Descrição"]}
            data={beneficios.map(beneficio => ({
              "Tipo": beneficio.tipo,
              "Valor": beneficio.valor || "-",
              "Descrição": beneficio.descricao || "-"
            }))}
          />
        ) : (
          <div>
            <h3 className="text-lg font-medium mb-2">Benefícios Resumidos:</h3>
            <ul className="list-disc list-inside space-y-1">
              {valeRefeicao && (
                <li>Vale Refeição: {valeRefeicao} 
                  {valeRefeicaoValor ? ` (R$ ${valeRefeicaoValor.toFixed(2)})` : ''}
                </li>
              )}
              {assistenciaMedica && <li>Assistência Médica</li>}
              {seguroVida && <li>Seguro de Vida</li>}
              {uniforme && <li>Uniforme</li>}
              {adicionalNoturno && <li>Adicional Noturno: {adicionalNoturno}</li>}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
