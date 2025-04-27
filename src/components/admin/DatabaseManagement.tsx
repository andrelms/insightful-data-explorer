
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function DatabaseManagement() {
  const [isClearing, setIsClearing] = useState(false);

  const handleClearDatabase = async () => {
    if (!confirm("Tem certeza que deseja limpar toda a base de dados? Esta ação não pode ser desfeita.")) {
      return;
    }

    setIsClearing(true);
    try {
      // Delete data from all tables in the correct order to respect foreign key constraints
      await supabase.from('feed_noticias').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('convencoes').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('uploaded_files').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('sindicatos').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('historico_importacao').delete().neq('id', '00000000-0000-0000-0000-000000000000');

      toast({
        title: "Base de dados limpa",
        description: "Todos os dados foram removidos com sucesso.",
        duration: 5000,
      });
    } catch (error) {
      console.error('Erro ao limpar base de dados:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao tentar limpar a base de dados.",
        variant: "destructive",
      });
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-500">
          <AlertTriangle className="h-5 w-5" />
          Gerenciamento da Base de Dados
        </CardTitle>
        <CardDescription>
          Limpe todos os dados do sistema, incluindo convenções, feeds, estatísticas e arquivos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Atenção</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>Esta ação irá remover permanentemente:</p>
                  <ul className="list-disc list-inside mt-1">
                    <li>Todas as convenções e acordos coletivos</li>
                    <li>Todos os arquivos enviados (Excel, PDF, CSV)</li>
                    <li>Todo o histórico de feeds e notícias</li>
                    <li>Todas as estatísticas e métricas</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <Button 
            variant="destructive" 
            onClick={handleClearDatabase}
            disabled={isClearing}
            className="w-full"
          >
            {isClearing ? "Limpando..." : "Limpar Base de Dados"}
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
};
