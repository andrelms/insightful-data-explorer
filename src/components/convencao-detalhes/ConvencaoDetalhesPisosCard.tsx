
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardTable } from "@/components/dashboard/DashboardTable";

interface PisoSalarial {
  id: string;
  cargo: string;
  carga_horaria: string | null;
  piso_salarial: number | null;
  valor_hora_normal: number | null;
  valor_hora_extra_50: number | null;
  valor_hora_extra_100: number | null;
}

interface ConvencaoDetalhesPisosCardProps {
  pisosSalariais: PisoSalarial[];
}

export function ConvencaoDetalhesPisosCard({ pisosSalariais }: ConvencaoDetalhesPisosCardProps) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-base">Pisos Salariais</CardTitle>
      </CardHeader>
      <CardContent>
        {pisosSalariais.length > 0 ? (
          <DashboardTable 
            columns={["Cargo", "Carga Horária", "Piso Salarial", "Hora Normal", "Hora Extra 50%", "Hora Extra 100%"]}
            data={pisosSalariais.map(piso => ({
              "Cargo": piso.cargo,
              "Carga Horária": piso.carga_horaria || "-",
              "Piso Salarial": piso.piso_salarial ? `R$ ${piso.piso_salarial.toFixed(2)}` : "-",
              "Hora Normal": piso.valor_hora_normal ? `R$ ${piso.valor_hora_normal.toFixed(2)}` : "-",
              "Hora Extra 50%": piso.valor_hora_extra_50 ? `R$ ${piso.valor_hora_extra_50.toFixed(2)}` : "-",
              "Hora Extra 100%": piso.valor_hora_extra_100 ? `R$ ${piso.valor_hora_extra_100.toFixed(2)}` : "-"
            }))}
          />
        ) : (
          <p className="text-center text-muted-foreground py-4">Nenhum piso salarial registrado.</p>
        )}
      </CardContent>
    </Card>
  );
}
