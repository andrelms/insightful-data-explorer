
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export function LogsSection() {
  return (
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
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
