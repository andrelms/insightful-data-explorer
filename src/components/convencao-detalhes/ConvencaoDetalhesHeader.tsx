
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Download, ExternalLink } from "lucide-react";

interface ConvencaoDetalhesHeaderProps {
  onVoltar: () => void;
  titulo: string;
  numero: string;
  tipo: string;
  isActive: boolean;
}

export function ConvencaoDetalhesHeader({ 
  onVoltar, 
  titulo, 
  numero, 
  tipo, 
  isActive 
}: ConvencaoDetalhesHeaderProps) {
  return (
    <>
      <div className="flex flex-wrap justify-between items-center gap-4">
        <Button 
          variant="ghost" 
          onClick={onVoltar}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Voltar
        </Button>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Baixar PDF
          </Button>
          <Button size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            Ver documento original
          </Button>
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-2">{titulo}</h1>
        <div className="flex flex-wrap gap-2 items-center">
          <Badge variant={isActive ? "default" : "outline"} className="text-xs">
            {isActive ? "VIGENTE" : "EXPIRADA"}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {numero} / {tipo}
          </span>
        </div>
      </div>
    </>
  );
}
