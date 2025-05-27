
import React from "react";
import { Badge } from "@/components/ui/badge";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

interface ConvencaoHeaderProps {
  descricao: string;
  estado?: string;
  vigenciaInicio: string | null;
  vigenciaFim: string | null;
  dataBase?: string;
}

export function ConvencaoHeader({ 
  descricao, 
  estado, 
  vigenciaInicio, 
  vigenciaFim, 
  dataBase 
}: ConvencaoHeaderProps) {
  const formatarData = (dataString: string | null) => {
    if (!dataString) return "-";
    try {
      const data = new Date(dataString);
      return data.toLocaleDateString('pt-BR');
    } catch (e) {
      return dataString;
    }
  };

  const renderTipoConvencao = () => {
    return <Badge variant="outline" className="bg-blue-100 text-blue-700">Convenção Coletiva</Badge>;
  };

  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <div>
        <CardTitle className="text-xl font-bold">{descricao || "Convenção"}</CardTitle>
        <CardDescription>
          {renderTipoConvencao()}
          {estado && (
            <Badge variant="outline" className="ml-2">
              {estado}
            </Badge>
          )}
        </CardDescription>
      </div>
      <div className="flex flex-col items-start md:items-end">
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="w-4 h-4 mr-1" />
          <span>Vigência: {formatarData(vigenciaInicio)} até {formatarData(vigenciaFim)}</span>
        </div>
        {dataBase && (
          <div className="flex items-center text-sm text-muted-foreground mt-1">
            <Calendar className="w-4 h-4 mr-1" />
            <span>Data Base: {dataBase}</span>
          </div>
        )}
      </div>
    </div>
  );
}
