
import React from "react";
import { Users } from "lucide-react";

interface SindicatoInfo {
  nome?: string;
  cnpj?: string;
  site?: string;
}

interface ConvencaoInfoProps {
  sindicato: SindicatoInfo | null;
}

export function ConvencaoInfo({ sindicato }: ConvencaoInfoProps) {
  return (
    <div className="mb-6">
      <div className="flex items-start gap-2 mb-2">
        <Users className="h-5 w-5 text-blue-500 mt-0.5" />
        <div>
          <h3 className="font-medium">Sindicato</h3>
          <p className="text-muted-foreground">
            {sindicato?.nome || "Não informado"}
          </p>
          {sindicato?.cnpj && (
            <p className="text-xs text-muted-foreground">
              CNPJ: {sindicato.cnpj}
            </p>
          )}
          {sindicato?.site && (
            <p className="text-xs text-blue-500">
              <a 
                href={sindicato.site.startsWith('http') ? sindicato.site : `http://${sindicato.site}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {sindicato.site}
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
