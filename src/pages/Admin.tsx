
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Upload, Database, AlertTriangle } from "lucide-react";

const Admin = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleImportData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Aqui você poderia adicionar um toast de sucesso
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Área Administrativa</h1>
        <p className="text-muted-foreground">
          Gerencie a importação de dados, configure o banco de dados e monitore o sistema.
        </p>
      </div>

      <Tabs defaultValue="import" className="w-full">
        <TabsList>
          <TabsTrigger value="import">Importação</TabsTrigger>
          <TabsTrigger value="database">Banco de Dados</TabsTrigger>
          <TabsTrigger value="logs">Logs do Sistema</TabsTrigger>
        </TabsList>
        
        {/* Tab de Importação */}
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
                  <Input type="date" id="start-date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">Data final</Label>
                  <Input type="date" id="end-date" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="filter">Filtros adicionais</Label>
                <Input 
                  id="filter" 
                  placeholder="Ex: tpRequerimento=convencao" 
                  defaultValue="tpRequerimento=convencao"
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
        
        {/* Tab de Banco de Dados */}
        <TabsContent value="database" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Status do Banco de Dados
              </CardTitle>
              <CardDescription>
                Informações sobre o banco de dados do sistema.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-muted/40 p-4 rounded-md">
                  <p className="font-medium mb-2">Estatísticas</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span>Total de tabelas:</span>
                      <span>8</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Total de registros:</span>
                      <span>4.234</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Tamanho do banco:</span>
                      <span>256 MB</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Último backup:</span>
                      <span>25/04/2023 00:00</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-muted/40 p-4 rounded-md">
                  <p className="font-medium mb-2">Tabelas principais</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span>sindicatos</span>
                      <span>125 registros</span>
                    </li>
                    <li className="flex justify-between">
                      <span>convencoes</span>
                      <span>856 registros</span>
                    </li>
                    <li className="flex justify-between">
                      <span>clausulas</span>
                      <span>3.245 registros</span>
                    </li>
                    <li className="flex justify-between">
                      <span>importacoes</span>
                      <span>8 registros</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar Índices
              </Button>
              <Button variant="outline" size="sm">
                Exportar Dados
              </Button>
              <Button variant="outline" size="sm">
                Criar Backup
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Tab de Logs */}
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
