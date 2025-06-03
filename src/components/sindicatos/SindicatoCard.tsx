
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, MapPin, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SindicatoData } from "@/types/sindicatos";
import { SindicatoDetails } from "./SindicatoDetails";

interface SindicatoCardProps {
  sindicato: SindicatoData;
  sindIdx: number;
  estadoSigla: string;
  isExpanded: boolean;
  onToggle: () => void;
}

export function SindicatoCard({ sindicato, sindIdx, estadoSigla, isExpanded, onToggle }: SindicatoCardProps) {
  return (
    <div className="border-t first:border-t-0">
      <div 
        className="p-4 cursor-pointer hover:bg-muted/50 flex justify-between items-center"
        onClick={onToggle}
      >
        <div className="font-medium text-primary">{sindicato.nome}</div>
        <ChevronDown className={cn(
          "h-5 w-5 text-muted-foreground transition-transform",
          isExpanded && "transform rotate-180"
        )} />
      </div>
      
      {isExpanded && (
        <div className="p-4 pt-0 space-y-4 text-sm">
          {sindicato.cnpj && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <Info className="h-3 w-3" />
              <span>CNPJ: {sindicato.cnpj}</span>
            </div>
          )}
          
          <SindicatoDetails sindicato={sindicato} />
          
          <div className="pt-2 mt-4 border-t text-center">
            <Button variant="link" size="sm" className="text-xs text-muted-foreground">
              Ver detalhes da convenção
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
