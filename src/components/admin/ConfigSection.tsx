
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export function ConfigSection() {
  const [isLoading, setIsLoading] = useState(false);
  const [geminiKey, setGeminiKey] = useState("");

  useEffect(() => {
    const fetchGeminiKey = async () => {
      try {
        const { data, error } = await supabase
          .from('configuracoes')
          .select('valor')
          .eq('chave', 'gemini_api_key')
          .single();

        if (error) throw error;
        if (data) setGeminiKey(data.valor || "");
      } catch (error) {
        console.error('Erro ao carregar chave da API:', error);
      }
    };

    fetchGeminiKey();
  }, []);

  const handleSaveGeminiKey = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('configuracoes')
        .update({ valor: geminiKey })
        .eq('chave', 'gemini_api_key');

      if (error) throw error;

      toast({
        title: "Configuração salva",
        description: "A chave da API do Gemini foi atualizada com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao salvar chave:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a chave da API.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações do Sistema</CardTitle>
        <CardDescription>
          Gerencie as chaves de API e outras configurações do sistema.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
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
              onClick={handleSaveGeminiKey}
              disabled={isLoading}
            >
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
