
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Particularidade {
  id: string;
  descricao: string;
}

interface ConvencaoDetalhesParticularidadesCardProps {
  particularidades: Particularidade[];
}

export function ConvencaoDetalhesParticularidadesCard({ 
  particularidades 
}: ConvencaoDetalhesParticularidadesCardProps) {
  if (particularidades.length === 0) {
    return null;
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-base">Particularidades</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {particularidades.map((item, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>{item.descricao}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
