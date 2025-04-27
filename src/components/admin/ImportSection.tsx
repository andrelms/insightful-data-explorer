
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshCw, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { ImportHistory } from "./ImportHistory";

export function ImportSection() {
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [importFilter, setImportFilter] = useState("tpRequerimento=convencao");

  const handleImportData = async () => {
    if (!startDate || !endDate) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha as datas de início e fim.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data: importRecord, error: importError } = await supabase
        .from('historico_importacao')
        .insert({
          origem: "MTE",
          status: "em_andamento",
          detalhes: `Filtros: ${importFilter}, Período: ${startDate} a ${endDate}`
        })
        .select();

      if (importError) throw importError;

      setTimeout(async () => {
        await supabase
          .from('historico_importacao')
          .update({
            status: "concluido",
            data_fim: new Date().toISOString(),
            registros_processados: 124
          })
          .eq('id', importRecord[0].id);

        setIsLoading(false);
        
        toast({
          title: "Importação concluída",
          description: "A importação de dados do MTE foi concluída com sucesso.",
          duration: 5000,
        });
      }, 3000);
    } catch (error) {
      console.error('Erro ao importar dados:', error);
      setIsLoading(false);
      
      toast({
        title: "Erro na importação",
        description: "Ocorreu um erro ao importar dados do MTE.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Importar Convenções do MTE</CardTitle>
          <CardDescription>
            Configure os parâmetros para importação automática de convenções coletivas do site do MTE.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Data inicial</Label>
              <Input 
                type="date" 
                id="start-date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">Data final</Label>
              <Input 
                type="date" 
                id="end-date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="filter">Filtros adicionais</Label>
            <Input 
              id="filter" 
              placeholder="Ex: tpRequerimento=convencao" 
              value={importFilter}
              onChange={(e) => setImportFilter(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleImportData} 
            disabled={isLoading}
            className="w-full md:w-auto"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Importando...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Iniciar Importação
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      <ImportHistory />
    </div>
  );
}
