
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
  valeRefeicao?: string | null;
  valeRefeicaoValor?: number | null;
  assistenciaMedica?: boolean | null;
  seguroVida?: boolean | null;
  uniforme?: boolean | null;
  adicionalNoturno?: string | null;
}

export function ConvencaoDetalhesBeneficiosCard({
  beneficios
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
          <p className="text-center text-muted-foreground py-4">Nenhum benefício registrado.</p>
        )}
      </CardContent>
    </Card>
  );
}
