
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshCw } from "lucide-react";

interface MteConfigSectionProps {
  mteUrl: string;
  mteToken: string;
  setMteUrl: (value: string) => void;
  setMteToken: (value: string) => void;
  handleSave: () => Promise<void>;
  isLoading: boolean;
}

export function MteConfigSection({ mteUrl, mteToken, setMteUrl, setMteToken, handleSave, isLoading }: MteConfigSectionProps) {
  return (
    <div className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="mte-url">URL do Mediador MTE</Label>
        <Input 
          id="mte-url" 
          value={mteUrl}
          onChange={(e) => setMteUrl(e.target.value)}
          placeholder="https://www3.mte.gov.br/sistemas/mediador/consultarins"
        />
      </div>
      
      <div className="space-y-2 mt-4">
        <Label htmlFor="mte-token">Token de API (se necessário)</Label>
        <Input 
          id="mte-token" 
          type="password" 
          placeholder="••••••••"
          value={mteToken}
          onChange={(e) => setMteToken(e.target.value)}
        />
      </div>
      
      <Button 
        onClick={handleSave}
        disabled={isLoading}
        className="mt-4"
      >
        {isLoading ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Salvando...
          </>
        ) : "Salvar Configurações"}
      </Button>
    </div>
  );
}
