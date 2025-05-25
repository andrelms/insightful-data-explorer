
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Clock } from "lucide-react";

interface Sindicato {
  nome: string;
  cnpj: string | null;
  site: string | null;
}

interface ConvencaoDetalhesInfoCardProps {
  vigenciaInicio: string | null;
  vigenciaFim: string | null;
  dataBase: string | null;
  sindicato: Sindicato | null;
  estado: string | null;
  fonte: string;
  valeRefeicao: string | null;
  assistenciaMedica: boolean | null;
  seguroVida: boolean | null;
  uniforme: boolean | null;
  formatDate: (dateString: string | null) => string;
}

export function ConvencaoDetalhesInfoCard({
  vigenciaInicio,
  vigenciaFim,
  dataBase,
  sindicato,
  estado,
  fonte,
  valeRefeicao,
  assistenciaMedica,
  seguroVida,
  uniforme,
  formatDate
}: ConvencaoDetalhesInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Informações Gerais</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div>
          <div className="flex items-center gap-2 font-medium text-muted-foreground mb-1">
            <CalendarDays className="h-4 w-4" />
            Vigência
          </div>
          <p>
            {formatDate(vigenciaInicio)} até{" "}
            {formatDate(vigenciaFim)}
          </p>
        </div>
        
        <div>
          <div className="flex items-center gap-2 font-medium text-muted-foreground mb-1">
            <Clock className="h-4 w-4" />
            Data Base
          </div>
          <p>{formatDate(dataBase)}</p>
        </div>
        
        <div>
          <p className="font-medium text-muted-foreground mb-2">Sindicatos Participantes</p>
          <ul className="space-y-2">
            {sindicato && (
              <li key={sindicato.nome} className="text-sm">
                <p className="font-medium">{sindicato.nome}</p>
                {sindicato.cnpj && (
                  <p className="text-muted-foreground text-xs">CNPJ: {sindicato.cnpj}</p>
                )}
                {sindicato.site && (
                  <p className="text-muted-foreground text-xs">
                    <a href={sindicato.site} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      {sindicato.site}
                    </a>
                  </p>
                )}
              </li>
            )}
          </ul>
        </div>
        
        <div>
          <p className="font-medium text-muted-foreground mb-1">Estado</p>
          <p>{estado || "Não especificado"}</p>
        </div>
        
        <div>
          <p className="font-medium text-muted-foreground mb-1">Fonte</p>
          <p>{fonte}</p>
        </div>
        
        <div>
          <p className="font-medium text-muted-foreground mb-2">Benefícios</p>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Vale Refeição:</span>
              <span className="font-medium">{valeRefeicao || "Não especificado"}</span>
            </div>
            <div className="flex justify-between">
              <span>Assistência Médica:</span>
              <span className="font-medium">{assistenciaMedica ? "Sim" : "Não"}</span>
            </div>
            <div className="flex justify-between">
              <span>Seguro de Vida:</span>
              <span className="font-medium">{seguroVida ? "Sim" : "Não"}</span>
            </div>
            <div className="flex justify-between">
              <span>Uniforme:</span>
              <span className="font-medium">{uniforme ? "Sim" : "Não"}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
