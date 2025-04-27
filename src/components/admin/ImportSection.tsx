
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshCw, Upload, Link } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { ImportHistory } from "./ImportHistory";

export function ImportSection() {
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [importFilter, setImportFilter] = useState("tpRequerimento=convencao");
  const [abrangencia, setAbrangencia] = useState<string[]>(["municipal", "intermunicipal", "estadual", "interestadual", "nacional"]);

  const toggleAbrangencia = (valor: string) => {
    if (abrangencia.includes(valor)) {
      setAbrangencia(abrangencia.filter(a => a !== valor));
    } else {
      setAbrangencia([...abrangencia, valor]);
    }
  };

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
      // Prepare detailed metadata for the import operation
      const detalhes = {
        filtros: importFilter,
        periodo: `${startDate} a ${endDate}`,
        abrangencia: abrangencia,
        url: "https://www3.mte.gov.br/sistemas/mediador/consultarins"
      };

      const { data: importRecord, error: importError } = await supabase
        .from('historico_importacao')
        .insert({
          origem: "MTE",
          status: "em_andamento",
          detalhes: JSON.stringify(detalhes)
        })
        .select();

      if (importError) throw importError;

      // Simulate import process (would be replaced with actual API call in production)
      setTimeout(async () => {
        await supabase
          .from('historico_importacao')
          .update({
            status: "concluido",
            data_fim: new Date().toISOString(),
            registros_processados: Math.floor(Math.random() * 100) + 50 // Random number between 50-150
          })
          .eq('id', importRecord![0].id);

        setIsLoading(false);
        
        toast({
          title: "Importação concluída",
          description: "A importação de dados do MTE foi concluída com sucesso.",
          duration: 5000,
        });

        // Refresh page to show updated history
        window.location.reload();
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

  const handleOpenMTEWebsite = () => {
    window.open("https://www3.mte.gov.br/sistemas/mediador/consultarins", "_blank");
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Importar Convenções do MTE</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleOpenMTEWebsite}
              className="gap-1 text-xs"
            >
              <Link className="h-3 w-3" />
              Abrir site MTE
            </Button>
          </CardTitle>
          <CardDescription>
            Configure os parâmetros para importação automática de convenções coletivas do site do MTE (Mediador).
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

          <div className="space-y-2">
            <Label>Abrangência</Label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: "municipal", label: "Municipal" },
                { id: "intermunicipal", label: "Intermunicipal" },
                { id: "estadual", label: "Estadual" },
                { id: "interestadual", label: "Interestadual" },
                { id: "nacional", label: "Nacional" }
              ].map(option => (
                <Button
                  key={option.id}
                  variant={abrangencia.includes(option.id) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleAbrangencia(option.id)}
                  className="text-xs"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="p-3 bg-muted/30 rounded-md text-sm">
            <p>Os dados serão coletados do sistema <strong>Mediador</strong> do MTE conforme os parâmetros configurados.</p>
            <p className="text-xs text-muted-foreground mt-1">As convenções serão processadas automaticamente e adicionadas ao banco de dados.</p>
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
