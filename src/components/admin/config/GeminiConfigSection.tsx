
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshCw } from "lucide-react";

interface GeminiConfigSectionProps {
  geminiKey: string;
  setGeminiKey: (value: string) => void;
  handleSave: () => Promise<void>;
  isLoading: boolean;
}

export function GeminiConfigSection({ geminiKey, setGeminiKey, handleSave, isLoading }: GeminiConfigSectionProps) {
  return (
    <div className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="gemini-key">Chave da API do Google Gemini</Label>
        <div className="flex gap-2">
          <Input
            id="gemini-key"
            type="password"
            value={geminiKey}
            onChange={(e) => setGeminiKey(e.target.value)}
            placeholder="Insira sua chave da API do Gemini"
          />
          <Button 
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : "Salvar"}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Esta chave é usada para alimentar o chat IA e processamento de documentos
        </p>
      </div>
    </div>
  );
}
