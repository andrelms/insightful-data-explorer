import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Upload, Database, AlertTriangle, Settings, FileText } from "lucide-react";
import { DatabaseManagement } from "@/components/admin/DatabaseManagement";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

const Admin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [geminiKey, setGeminiKey] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [importFilter, setImportFilter] = useState("tpRequerimento=convencao");

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Área Administrativa</h1>
        <p className="text-muted-foreground">
          Gerencie a importação de dados, configure o banco de dados e monitore o sistema.
        </p>
      </div>

      <Tabs defaultValue="import" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="import">
            <Upload className="h-4 w-4 mr-2" />
            Importação
          </TabsTrigger>
          <TabsTrigger value="database">
            <Database className="h-4 w-4 mr-2" />
            Banco de Dados
          </TabsTrigger>
          <TabsTrigger value="config">
            <Settings className="h-4 w-4 mr-2" />
            Configurações
          </TabsTrigger>
          <TabsTrigger value="logs">
            <FileText className="h-4 w-4 mr-2" />
            Logs
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="import" className="space-y-4">
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
          
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Importações</CardTitle>
              <CardDescription>
                Registros das importações realizadas no sistema.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Qtd. Registros</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>25/04/2023 08:30</TableCell>
                    <TableCell>sistema@auto.com</TableCell>
                    <TableCell>124</TableCell>
                    <TableCell><Badge variant="secondary" className="bg-green-500 text-white">Concluído</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>18/04/2023 10:15</TableCell>
                    <TableCell>admin@sindicato.org</TableCell>
                    <TableCell>87</TableCell>
                    <TableCell><Badge variant="secondary" className="bg-green-500 text-white">Concluído</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>10/04/2023 14:22</TableCell>
                    <TableCell>sistema@auto.com</TableCell>
                    <TableCell>56</TableCell>
                    <TableCell><Badge variant="secondary" className="bg-green-500 text-white">Concluído</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>02/04/2023 09:45</TableCell>
                    <TableCell>admin@sindicato.org</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell><Badge variant="destructive">Erro</Badge></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="database">
          <div className="grid gap-6">
            <DatabaseManagement />
          </div>
        </TabsContent>
        
        <TabsContent value="config">
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
        </TabsContent>
        
        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Logs do Sistema
                </CardTitle>
                <CardDescription>
                  Registros de atividades e erros do sistema.
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                Exportar Logs
              </Button>
            </CardHeader>
            <CardContent>
              <div className="max-h-[400px] overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[120px]">Timestamp</TableHead>
                      <TableHead className="w-[100px]">Nível</TableHead>
                      <TableHead>Mensagem</TableHead>
                      <TableHead className="w-[120px]">Módulo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>25/04/2023 15:32:45</TableCell>
                      <TableCell><Badge className="bg-yellow-500">WARN</Badge></TableCell>
                      <TableCell>Tentativa de acesso com credenciais inválidas</TableCell>
                      <TableCell>auth</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>25/04/2023 14:56:12</TableCell>
                      <TableCell><Badge variant="outline">INFO</Badge></TableCell>
                      <TableCell>Importação de dados concluída com sucesso</TableCell>
                      <TableCell>import</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>25/04/2023 14:30:05</TableCell>
                      <TableCell><Badge variant="outline">INFO</Badge></TableCell>
                      <TableCell>Início da importação de dados do MTE</TableCell>
                      <TableCell>import</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>25/04/2023 12:23:18</TableCell>
                      <TableCell><Badge variant="destructive">ERROR</Badge></TableCell>
                      <TableCell>Falha na conexão com servidor externo</TableCell>
                      <TableCell>api</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>25/04/2023 10:15:42</TableCell>
                      <TableCell><Badge variant="outline">INFO</Badge></TableCell>
                      <TableCell>Usuário admin@sindicato.org autenticado</TableCell>
                      <TableCell>auth</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>25/04/2023 08:30:00</TableCell>
                      <TableCell><Badge variant="outline">INFO</Badge></TableCell>
                      <TableCell>Sistema iniciado com sucesso</TableCell>
                      <TableCell>system</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
